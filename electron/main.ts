import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";
import * as url from "url";
import { PythonShell } from "python-shell";
import { Options } from 'electron/main';

let appWindow: BrowserWindow;

function initWindow() {
  appWindow = new BrowserWindow({
    width: 1024,
    height: 768,
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

  // Initialize the DevTools.
  appWindow.webContents.openDevTools()

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
    // receive print messages in real time from python
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