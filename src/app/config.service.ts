import { Injectable } from '@angular/core';
const electron = (<any>window).require('electron');

// Angular configuration service that wraps calls to the Electron main process
// Using electron-store NPM package to handle file-based configuration from Node/Electron (main.ts)
@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  get(key: string): Promise<string> {
    return electron.ipcRenderer.invoke('getConfig', key);
  }

  set(key: string, value: string): void {
    electron.ipcRenderer.invoke('setConfig', key, value);
  }
}
