const { app, BrowserWindow, dialog, ipcMain, Menu, nativeImage, net, protocol, session, shell, Tray } = require('electron');
const fs = require('node:fs/promises');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const APP_SCHEME = 'simapp';
const APP_ID = 'com.harrissoftwaresolutions.simapp';
const isDevelopment = !app.isPackaged && Boolean(process.env.VITE_DEV_SERVER_URL);
let mainWindow = null;
let splashWindow = null;
let tray = null;
let isQuitting = false;

protocol.registerSchemesAsPrivileged([
  {
    scheme: APP_SCHEME,
    privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true, stream: true },
  },
]);

app.setAppUserModelId(APP_ID);

function getRendererRoot() {
  // The renderer is inside app.asar when packaged. Using process.resourcesPath
  // would incorrectly look for resources/dist outside the archive.
  return path.join(app.isPackaged ? app.getAppPath() : path.join(__dirname, '..'), 'dist');
}

function getRendererAsset(name) {
  return path.join(getRendererRoot(), name);
}

function getDataRoot() {
  return path.join(app.getPath('userData'), 'scripture-in-music');
}

function safeName(value, fallback = 'recording') {
  const normalized = String(value || '').trim().replace(/[^a-z0-9._-]+/gi, '-');
  return normalized || fallback;
}

async function ensureDataRoot() {
  await fs.mkdir(getDataRoot(), { recursive: true });
}

function resolveRendererPath(requestUrl) {
  const url = new URL(requestUrl);
  const requested = decodeURIComponent(url.pathname).replace(/^\/+/, '') || 'index.html';
  const rendererRoot = path.resolve(getRendererRoot());
  const candidate = path.resolve(rendererRoot, requested);
  if (candidate !== rendererRoot && !candidate.startsWith(`${rendererRoot}${path.sep}`)) {
    throw new Error('Renderer path escaped the packaged renderer directory.');
  }
  return candidate;
}

function registerLocalProtocol() {
  protocol.handle(APP_SCHEME, async (request) => {
    try {
      const filePath = resolveRendererPath(request.url);
      return await netFetchFile(filePath);
    } catch (error) {
      return new Response(String(error.message || error), { status: 404 });
    }
  });
}

async function netFetchFile(filePath) {
  const data = await fs.readFile(filePath);
  const extension = path.extname(filePath).toLowerCase();
  const contentTypes = {
    '.css': 'text/css',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
  };
  return new Response(data, { headers: { 'content-type': contentTypes[extension] || 'application/octet-stream' } });
}

async function createWindow() {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.show();
    mainWindow.focus();
    return mainWindow;
  }

  const window = new BrowserWindow({
    width: 1440,
    height: 960,
    minWidth: 900,
    minHeight: 640,
    backgroundColor: '#0B1220',
    title: 'Scripture in Music',
    icon: getRendererAsset('icon-192.png'),
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  window.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('simapp://') || url.startsWith('http://127.0.0.1:5173')) return { action: 'allow' };
    shell.openExternal(url);
    return { action: 'deny' };
  });

  window.webContents.on('will-navigate', (event, url) => {
    const allowed = url.startsWith('simapp://') || url.startsWith('http://127.0.0.1:5173');
    if (!allowed) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  window.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      window.hide();
    }
  });
  window.on('closed', () => {
    mainWindow = null;
  });

  mainWindow = window;

  try {
    if (isDevelopment) {
      await window.loadURL(process.env.VITE_DEV_SERVER_URL);
    } else {
      await window.loadURL(`${APP_SCHEME}://app/index.html`);
    }
    window.show();
  } finally {
    if (splashWindow && !splashWindow.isDestroyed()) {
      splashWindow.close();
      splashWindow = null;
    }
  }

  return window;
}

function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 720,
    height: 420,
    frame: false,
    resizable: false,
    movable: true,
    center: true,
    show: true,
    backgroundColor: '#0B1220',
    icon: getRendererAsset('icon-192.png'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });
  splashWindow.setMenuBarVisibility(false);
  splashWindow.loadURL(`${APP_SCHEME}://app/splash.html`).catch(() => {});
  return splashWindow;
}

function createTray() {
  if (tray && !tray.isDestroyed()) return tray;

  const image = nativeImage.createFromPath(getRendererAsset('icon-192.png'));
  tray = new Tray(image.isEmpty() ? nativeImage.createEmpty() : image.resize({ width: 32, height: 32 }));
  tray.setToolTip('Scripture in Music — Offline Edition');
  tray.setContextMenu(Menu.buildFromTemplate([
    {
      label: 'Open Scripture in Music',
      click: () => {
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.show();
          mainWindow.focus();
        } else {
          createWindow();
        }
      },
    },
    { type: 'separator' },
    { label: 'Quit', click: () => { isQuitting = true; app.quit(); } },
  ]));
  tray.on('click', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      if (mainWindow.isVisible()) mainWindow.hide();
      else { mainWindow.show(); mainWindow.focus(); }
    }
  });
  return tray;
}

ipcMain.handle('storage:save-json', async (_event, { key, value }) => {
  await ensureDataRoot();
  const filename = `${safeName(key, 'record')}.json`;
  await fs.writeFile(path.join(getDataRoot(), filename), JSON.stringify(value, null, 2), 'utf8');
  return { ok: true, key: filename.slice(0, -5) };
});

ipcMain.handle('storage:get-json', async (_event, key) => {
  try {
    const filename = `${safeName(key, 'record')}.json`;
    const value = JSON.parse(await fs.readFile(path.join(getDataRoot(), filename), 'utf8'));
    return { ok: true, value };
  } catch (error) {
    if (error.code === 'ENOENT') return { ok: true, value: null };
    throw error;
  }
});

ipcMain.handle('storage:delete-json', async (_event, key) => {
  await fs.rm(path.join(getDataRoot(), `${safeName(key, 'record')}.json`), { force: true });
  return { ok: true };
});

ipcMain.handle('recording:save', async (_event, { filename, bytes }) => {
  const result = await dialog.showSaveDialog({
    defaultPath: safeName(filename, 'scripture-recording.webm'),
    filters: [{ name: 'Audio', extensions: ['webm', 'wav', 'mp3'] }],
  });
  if (result.canceled || !result.filePath) return { ok: false, canceled: true };
  await fs.writeFile(result.filePath, Buffer.from(bytes));
  return { ok: true, path: result.filePath };
});

app.whenReady().then(async () => {
  registerLocalProtocol();
  session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback) => {
    callback(permission === 'media');
  });
  createTray();
  createSplashWindow();
  await createWindow();
});

app.on('before-quit', () => {
  isQuitting = true;
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
