# Scripture in Music — Offline Edition

Scripture in Music is free, non-commercial educational software for scripture study, memorization, musical practice, and worship.

The application is designed to work locally on Windows, Android, and iOS. Local scripture content, practice progress, arrangements, and recordings do not require an account or network connection.

## Development

```bash
npm ci
npm run dev
npm run typecheck
npm run lint
npm run test
npm run build
```

`npm run lint:legacy` runs the original full-tree lint audit. The project currently contains historical utility files that are console-test helpers rather than Vitest suites; the focused `npm run test` command runs the maintained foundation suites.

## Desktop and mobile shells

```bash
npm run electron:dev
npm run electron:build
npm run mobile:sync
npm run mobile:open:android
npm run mobile:open:ios
```

Electron uses a secure preload bridge with local file storage. Capacitor provides the Android and iOS shells while the React renderer and scripture/composer models remain shared.

## Windows packaging policy

Windows packaging is manual and external-drive-only:

```bash
npm run package:external -- "feature-name" -Preflight
npm run package:external -- "feature-name"
```

The package script builds on `E:\SIMAPPBuilds` and copies the verified result to `D:\SIMAPPBackups`. It refuses to run when either drive is unavailable or unwritable, never falls back to `C:`, and never removes prior builds.

## Data and licensing

The complete KJV data pipeline belongs under `src/data/kjv/`. The exact source edition and all bundled fonts, soundfont samples, icons, and libraries must be recorded in [LICENSES.md](LICENSES.md) before distribution.
