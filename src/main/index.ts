import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join, basename } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import * as fs from 'fs'
import type { DirNode, FsNode } from '../types'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // Handle open directory dialog and return directory tree
  ipcMain.handle('dialog:openDirectory', async (): Promise<FsNode | null> => {
    const { canceled, filePaths } = await dialog.showOpenDialog({ properties: ['openDirectory'] })
    if (canceled || filePaths.length === 0) return null
    const dirPath = filePaths[0]
    function readTree(directory: string): FsNode[] {
      const dirents = fs.readdirSync(directory, { withFileTypes: true })
      return dirents.map((dirent) => {
        const fullPath = join(directory, dirent.name)
        if (dirent.isDirectory()) {
          const subChildren = readTree(fullPath)
          return {
            type: 'directory',
            name: dirent.name,
            path: fullPath,
            isOpen: false,
            state: 'unchecked',
            children: subChildren
          }
        }
        return { type: 'file', name: dirent.name, path: fullPath, state: 'unchecked' }
      })
    }
    const tree: DirNode = {
      type: 'directory',
      name: basename(dirPath),
      path: dirPath,
      isOpen: false,
      state: 'unchecked',
      children: readTree(dirPath)
    }
    return tree
  })

  ipcMain.handle(
    'file:readFiles',
    async (_event, paths: string[]): Promise<{ path: string; content: string }[]> => {
      const results: { path: string; content: string }[] = []
      for (const filePath of paths) {
        try {
          const content = await fs.promises.readFile(filePath, 'utf-8')
          results.push({ path: filePath, content })
        } catch (error) {
          results.push({
            path: filePath,
            content: `Error reading file: ${error instanceof Error ? error.message : String(error)}`
          })
        }
      }
      return results
    }
  )

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
