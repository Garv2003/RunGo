import { spawn } from 'child_process';
import { app, BrowserWindow, Menu, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import started from 'electron-squirrel-startup';
import { writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const isDev = process.env.NODE_ENV === 'development';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, './preload.js'),
    },
  });

  if (isDev) {
    mainWindow.loadURL(process.env.CLIENT_URL);
    mainWindow.webContents.openDevTools();
  } else {
    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    // Menu.setApplicationMenu(null);
  }
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle running Go code
ipcMain.handle('run-go-code', async (event, code) => {
  try {
    // Create a temporary file with the Go code
    const tmpFile = join(tmpdir(), `temp-${Date.now()}.go`);
    await writeFile(tmpFile, code);

    return new Promise((resolve, reject) => {
      const process = spawn('go', ['run', tmpFile]);
      
      let output = '';
      process.stdout.on('data', (data) => (output += data));
      process.stderr.on('data', (data) => (output += data));
      process.on('close', () => resolve(output));
      process.on('error', (err) => reject(err));
    });
  } catch (error) {
    return error.message;
  }
});
