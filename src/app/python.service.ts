import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
const electron = (<any>window).require('electron');
import { StartMultiScaleModel } from './start-multi-scale-form/start-multi-scale-model'


@Injectable({
  providedIn: 'root'
})
export class PythonService {
  pythonOutput = new BehaviorSubject<string[]>([]);

  constructor() {
    electron.ipcRenderer.on('pythonOutput', (event, output) => {
      this.pythonOutput.next(output);
    });
  }

  submitForm(model: StartMultiScaleModel) {
    electron.ipcRenderer.send('callPython', JSON.stringify(model));
  }
}