const { app, BrowserWindow, Menu, dialog, shell } = require('electron')
const fs = require('fs')
const os = require('os')
const path = require('path')

app.setAppUserModelId('com.fayed.resort')

let mainWindow
let httpServer

if (os.release().startsWith('6.1')) {
  app.disableHardwareAcceleration()
}

const gotLock = app.requestSingleInstanceLock()
if (!gotLock) {
  app.quit()
}

function writeCrashLog(error) {
  try {
    const logFile = path.join(app.getPath('userData'), 'error.log')
    fs.appendFileSync(logFile, `${new Date().toISOString()}\n${error && error.stack ? error.stack : error}\n\n`)
  } catch {
    /* ignore */
  }
}

function projectRoot() {
  return app.isPackaged ? app.getAppPath() : path.join(__dirname, '..')
}

function iconPath() {
  const packaged = path.join(process.resourcesPath, 'icon.ico')
  const bundled = path.join(projectRoot(), 'icon', 'fayed-resort.ico')
  if (fs.existsSync(packaged)) return packaged
  if (fs.existsSync(bundled)) return bundled
  return undefined
}

function wasmPath() {
  const candidates = [
    path.join(process.resourcesPath, 'app.asar.unpacked', 'node_modules', 'sql.js', 'dist', 'sql-wasm.wasm'),
    path.join(projectRoot(), 'node_modules', 'sql.js', 'dist', 'sql-wasm.wasm'),
  ]
  return candidates.find((file) => fs.existsSync(file))
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true })
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name)
    const to = path.join(dest, entry.name)
    if (entry.isDirectory()) copyDir(from, to)
    else fs.copyFileSync(from, to)
  }
}

function dataDirectory() {
  if (!app.isPackaged) return path.join(projectRoot(), 'database')

  const dest = path.join(app.getPath('userData'), 'database')
  fs.mkdirSync(dest, { recursive: true })
  const destDb = path.join(dest, 'fayed-resort.db')
  const seed = path.join(process.resourcesPath, 'database-seed')
  if (!fs.existsSync(destDb) && fs.existsSync(seed)) {
    copyDir(seed, dest)
  }
  return dest
}

async function createWindow() {
  const { configureDataPaths } = await import('../server/database.js')
  const { startDesktopServer } = await import('../server/desktop-server.js')

  const root = projectRoot()
  configureDataPaths({
    root,
    dataDir: dataDirectory(),
    wasmPath: wasmPath(),
  })

  const staticDir = path.join(root, 'dist')
  if (!fs.existsSync(path.join(staticDir, 'index.html'))) {
    throw new Error('ملفات البرنامج غير موجودة. شغّل البناء أولاً.')
  }

  const started = await startDesktopServer({ staticDir })
  httpServer = started.server

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 980,
    minHeight: 640,
    title: 'فايد ريزورت',
    icon: iconPath(),
    autoHideMenuBar: true,
    backgroundColor: '#0b3b3c',
    show: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      backgroundThrottling: false,
    },
  })

  Menu.setApplicationMenu(null)
  mainWindow.on('focus', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.focus()
    }
  })
  mainWindow.on('closed', () => {
    mainWindow = null
  })
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })
  await mainWindow.loadURL(started.url)
}

app.on('second-instance', () => {
  if (!mainWindow) return
  if (mainWindow.isMinimized()) mainWindow.restore()
  mainWindow.focus()
})

app.whenReady().then(createWindow).catch((error) => {
  writeCrashLog(error)
  dialog.showErrorBox('فايد ريزورت', error.message || String(error))
  app.quit()
})

app.on('window-all-closed', () => {
  if (httpServer) {
    try { httpServer.close() } catch { /* ignore */ }
  }
  app.quit()
})
