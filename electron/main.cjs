const { app, BrowserWindow, dialog, ipcMain, net, protocol, session, shell } = require('electron');
const fs = require('node:fs/promises');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const APP_SCHEME = 'simapp';
const APP_ID = 'com.harrissoftwaresolutions.simapp';
const isDevelopment = !app.isPackaged && Boolean(process.env.VITE_DEV_SERVER_URL);

protocol.registerSchemesAsPrivileged([
  {
    scheme: APP_SCHEME,
    privileges: { standard: true, secure: true, supportFetchAPI: true, corsEnabled: true, stream: true },
  },
]);

app.setAppUserModelId(APP_ID);

function getRendererRoot() {
  return path.join(app.isPackaged ? process.resourcesPath : path.join(__dirname, '..'), 'dist');
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
  const window = new BrowserWindow({
    width: 1440,
    height: 960,
    minWidth: 900,
    minHeight: 640,
    backgroundColor: '#0B1220',
    title: 'Scripture in Music',
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

  if (isDevelopment) {
    await window.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    await window.loadURL(`${APP_SCHEME}://app/index.html`);
  }
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
  await createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
