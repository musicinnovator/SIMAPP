[CmdletBinding()]
param(
  [Parameter(Mandatory = $true, Position = 0)]
  [ValidateNotNullOrEmpty()]
  [string]$FeatureLabel,

  [switch]$Preflight
)

$ErrorActionPreference = 'Stop'

function Get-SafeSlug([string]$value) {
  $slug = $value.Trim().ToLowerInvariant() -replace '[^a-z0-9]+', '-'
  $slug = $slug.Trim('-')
  if ([string]::IsNullOrWhiteSpace($slug)) { throw 'FeatureLabel must contain at least one letter or number.' }
  return $slug
}

function Assert-Drive([string]$root, [string]$label, [int64]$minimumFreeBytes) {
  if (-not (Test-Path -LiteralPath $root -PathType Container)) { throw "$label is unavailable. No fallback to C: is permitted." }
  $drive = [System.IO.DriveInfo]::new($root)
  if (-not $drive.IsReady) { throw "$label is not ready. No fallback to C: is permitted." }
  if ($drive.AvailableFreeSpace -lt $minimumFreeBytes) {
    throw "$label has insufficient free space: $([math]::Round($drive.AvailableFreeSpace / 1GB, 2)) GB available."
  }
  $probe = Join-Path $root ".simapp-write-test-$([guid]::NewGuid().ToString('N'))"
  try { [System.IO.File]::WriteAllText($probe, 'SIMAPP external packaging preflight') }
  catch { throw "$label is not writable. No fallback to C: is permitted. $($_.Exception.Message)" }
  finally { if (Test-Path -LiteralPath $probe) { Remove-Item -LiteralPath $probe -Force -ErrorAction SilentlyContinue } }
  return [pscustomobject]@{ Root = $root; Format = $drive.DriveFormat; FreeBytes = [int64]$drive.AvailableFreeSpace }
}

function Get-TreeStats([string]$root) {
  $files = @(Get-ChildItem -LiteralPath $root -Recurse -File -Force)
  [int64]$bytes = ($files | Measure-Object -Property Length -Sum).Sum
  [pscustomobject]@{ FileCount = $files.Count; TotalBytes = $bytes }
}

function Get-Sha256([string]$path) {
  (Get-FileHash -LiteralPath $path -Algorithm SHA256).Hash.ToLowerInvariant()
}

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$externalBuildRoot = 'E:\SIMAPPBuilds'
$backupRoot = 'D:\SIMAPPBackups'
$minimumFreeBytes = 5GB
$slug = Get-SafeSlug $FeatureLabel
$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$buildName = "win-unpacked-$slug-$timestamp"
$stagingRoot = Join-Path $externalBuildRoot ".staging-$buildName"
$builderOutput = Join-Path $stagingRoot 'builder-output'
$finalBuild = Join-Path $externalBuildRoot $buildName
$backupBuild = Join-Path $backupRoot $buildName
$sourceDist = Join-Path $repoRoot 'dist'

$e = Assert-Drive $externalBuildRoot 'E:' $minimumFreeBytes
$d = Assert-Drive $backupRoot 'D:' $minimumFreeBytes
if ($d.Format -eq 'FAT32') { Write-Warning "D: uses FAT32. The backup will fail if any generated file exceeds FAT32's 4 GB limit." }

Write-Host "SIMAPP external package: $buildName"
Write-Host ("E: available: {0:N2} GB" -f ($e.FreeBytes / 1GB))
Write-Host ("D: available: {0:N2} GB" -f ($d.FreeBytes / 1GB))
Write-Host 'Expected disk impact: one E: build, one D: backup copy, and temporary E: staging. Existing builds are never removed.'

if ($Preflight) {
  Write-Host 'Preflight passed. No build or backup was created.' -ForegroundColor Green
  exit 0
}

if (Test-Path -LiteralPath $finalBuild) { throw "Refusing to overwrite existing E: build: $finalBuild" }
if (Test-Path -LiteralPath $backupBuild) { throw "Refusing to overwrite existing D: backup: $backupBuild" }

$oldTemp = $env:TEMP
$oldTmp = $env:TMP
$oldBuilderCache = $env:ELECTRON_BUILDER_CACHE
$oldBuilderBinaries = $env:ELECTRON_BUILDER_BINARIES_CACHE
$stagingCreated = $false

try {
  New-Item -ItemType Directory -Path $externalBuildRoot, $backupRoot, $stagingRoot, $builderOutput -Force | Out-Null
  $stagingCreated = $true
  $env:TEMP = $stagingRoot
  $env:TMP = $stagingRoot
  $env:ELECTRON_BUILDER_CACHE = Join-Path $externalBuildRoot '.electron-builder-cache'
  $env:ELECTRON_BUILDER_BINARIES_CACHE = Join-Path $externalBuildRoot '.electron-builder-binaries-cache'
  New-Item -ItemType Directory -Path $env:ELECTRON_BUILDER_CACHE, $env:ELECTRON_BUILDER_BINARIES_CACHE -Force | Out-Null

  Push-Location $repoRoot
  try {
    & npm.cmd run build
    if ($LASTEXITCODE -ne 0) { throw 'Renderer build failed.' }
  } finally { Pop-Location }

  $configPath = Join-Path $stagingRoot 'electron-builder.config.cjs'
  $config = @"
module.exports = {
  appId: 'com.harrissoftwaresolutions.simapp',
  productName: 'Scripture in Music',
  directories: { output: '$($builderOutput.Replace('\', '/'))' },
  files: ['dist/**/*', 'electron/**/*', 'package.json'],
  asar: true,
  win: { executableName: 'ScriptureInMusic', target: ['dir'] }
};
"@
  [System.IO.File]::WriteAllText($configPath, $config, [System.Text.UTF8Encoding]::new($false))

  Push-Location $repoRoot
  try {
    & (Join-Path $repoRoot 'node_modules\.bin\electron-builder.cmd') --config $configPath --win --dir
    if ($LASTEXITCODE -ne 0) { throw 'Electron packaging failed.' }
  } finally { Pop-Location }

  $built = Join-Path $builderOutput 'win-unpacked'
  if (-not (Test-Path -LiteralPath $built -PathType Container)) { throw "Expected staged package is missing: $built" }
  $oversized = @(Get-ChildItem -LiteralPath $built -Recurse -File -Force | Where-Object Length -gt 4GB)
  if ($oversized.Count -gt 0) { throw "Generated file exceeds FAT32's 4 GB limit: $($oversized[0].FullName)" }

  Move-Item -LiteralPath $built -Destination $finalBuild
  Copy-Item -LiteralPath $finalBuild -Destination $backupBuild -Recurse

  $eStats = Get-TreeStats $finalBuild
  $dStats = Get-TreeStats $backupBuild
  if ($eStats.FileCount -ne $dStats.FileCount -or $eStats.TotalBytes -ne $dStats.TotalBytes) {
    throw "E:/D: backup mismatch. E=$($eStats.FileCount)/$($eStats.TotalBytes); D=$($dStats.FileCount)/$($dStats.TotalBytes)."
  }
  foreach ($eFile in Get-ChildItem -LiteralPath $finalBuild -Recurse -File -Force) {
    $relative = $eFile.FullName.Substring($finalBuild.Length).TrimStart('\')
    $dFile = Join-Path $backupBuild $relative
    if ((Get-Sha256 $eFile.FullName) -ne (Get-Sha256 $dFile)) { throw "E:/D: SHA-256 mismatch: $relative" }
  }

  Write-Host "E: build: $finalBuild ($($eStats.FileCount) files; $($eStats.TotalBytes) bytes)" -ForegroundColor Green
  Write-Host "D: backup: $backupBuild ($($dStats.FileCount) files; $($dStats.TotalBytes) bytes)" -ForegroundColor Green
}
finally {
  $env:TEMP = $oldTemp
  $env:TMP = $oldTmp
  $env:ELECTRON_BUILDER_CACHE = $oldBuilderCache
  $env:ELECTRON_BUILDER_BINARIES_CACHE = $oldBuilderBinaries
  if ($stagingCreated -and (Test-Path -LiteralPath $stagingRoot)) { Remove-Item -LiteralPath $stagingRoot -Recurse -Force }
}
