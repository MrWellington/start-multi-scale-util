import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
const electron = (<any>window).require('electron');

// Angular service that wraps calls to the Electron main process which will be used to communicate with Python and listen for output
// Using python-shell NPM package to manage these calls from Node/Electron (main.ts)
@Injectable({
  providedIn: 'root'
})
export class PythonService {
  pythonOutput = new BehaviorSubject<string>("");

  constructor() {
    electron.ipcRenderer.on('pythonOutput', (event, output) => {
      this.pythonOutput.next(output);
    });
  }

  submitForm(model: any) {
    electron.ipcRenderer.send('callPython', JSON.stringify(model));
  }
}
