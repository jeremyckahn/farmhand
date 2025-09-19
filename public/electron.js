// From: https://www.section.io/engineering-education/desktop-application-with-react/
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

import { app, BrowserWindow } from 'electron'
import isDev from 'electron-is-dev'

import electronUpdater from 'electron-updater'
const { autoUpdater } = electronUpdater

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
    },
    icon: join(
      isDev ? join(__dirname) : app.getAppPath(),
      './app-icons/Icon-512x512.png'
    ),
  })

  // and load the index.html of the app.
  // win.loadFile("index.html");
  if (isDev) {
    win.loadURL('http://localhost:3000')
  } else {
    win.loadFile(join(app.getAppPath(), 'dist/index.html'))
  }

  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools({ mode: 'detach' })
  }

  autoUpdater.checkForUpdatesAndNotify()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
