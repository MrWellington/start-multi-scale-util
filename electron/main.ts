import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import * as url from "url";
import { PythonShell } from "python-shell";
import { Options } from 'electron/main';
const Store = require('electron-store');

// Entry point to the Electron app
let appWindow: BrowserWindow;

function initWindow() {
  appWindow = new BrowserWindow({
    width: 1280,
    height: 1024,
    icon: "src/assets/jairevai_iconpng.png",
    webPreferences: {
      nodeIntegration: true
    }
  })

  // Electron Build Path
  appWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `/../../dist/index.html`),
      protocol: "file:",
      slashes: true
    })
  );

  // Initialize the DevTools. (for development)
  // appWindow.webContents.openDevTools()

  appWindow.on('closed', function () {
    appWindow = null
  })
}

app.on('ready', initWindow)

// Close when all windows are closed.
app.on('window-all-closed', function () {

  // On macOS specific close process
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (appWindow === null) {
    initWindow()
  }
})

ipcMain.on("callPython", (event, form) => {
  let options: Options = {
    mode: 'text',
    pythonOptions: ['-u'],
    scriptPath: path.join(__dirname, `/python`),
    args: [form]
  };

  let pyshell = PythonShell.run('test.py', options);

  pyshell.on('message', function (message) {
    // receive stdout in real time from python + bash
    appWindow.webContents.send("pythonOutput", message);
  });
   
  // end the input stream and allow the process to exit
  pyshell.end(function (err,code,signal) {
    if (err) {
      throw err;
    }
    appWindow.webContents.send("pythonOutput", "Python script finished successfully.");
  });
});

ipcMain.handle("getConfig", (event, key) => {
  let configStore = new Store();
  return configStore.get(key);
});

ipcMain.handle("setConfig", (event, ...args) => {
  let configStore = new Store();
  configStore.set(args[0], args[1]);
});