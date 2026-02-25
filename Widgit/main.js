const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs   = require('fs')

const ALLOWED_DATA_FILES = ['tasks', 'logs', 'today', 'bounds']

function dataPath(name) {
  if (!ALLOWED_DATA_FILES.includes(name)) return null
  return path.join(app.getPath('userData'), name + '.json')
}

// ── JSON file I/O (used by renderer via IPC) ───────────────────────────────
ipcMain.handle('read-json', (_e, name) => {
  const p = dataPath(name)
  if (!p) return null
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'))
  } catch {
    return null
  }
})

ipcMain.handle('write-json', (_e, name, data) => {
  const p = dataPath(name)
  if (!p) return false
  try {
    fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8')
    return true
  } catch {
    return false
  }
})

// ── Window position persistence ────────────────────────────────────────────
function loadBounds() {
  try {
    return JSON.parse(fs.readFileSync(dataPath('bounds'), 'utf8'))
  } catch {
    return null
  }
}

function saveBounds(win) {
  try {
    const { x, y } = win.getBounds()
    fs.writeFileSync(dataPath('bounds'), JSON.stringify({ x, y }), 'utf8')
  } catch { }
}

// ── Window ─────────────────────────────────────────────────────────────────
function createWindow() {
  const saved = loadBounds()

  const win = new BrowserWindow({
    width: 410,
    height: 680,
    x: saved?.x ?? undefined,
    y: saved?.y ?? undefined,
    resizable: false,
    frame: false,
    transparent: true,
    title: 'RealBuddy',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')

  // Save position whenever the window moves or closes
  win.on('moved', () => saveBounds(win))
  win.on('close',  () => saveBounds(win))
}

// ── App lifecycle ──────────────────────────────────────────────────────────
app.whenReady().then(() => {
  // Register as a login/startup item when running as an installed build
  if (app.isPackaged) {
    app.setLoginItemSettings({ openAtLogin: true })
  }

  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
