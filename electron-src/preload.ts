/* eslint-disable @typescript-eslint/no-namespace */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { contextBridge, ipcRenderer, IpcRenderer } from 'electron';
import { ApiActions, ApiRequest } from 'messages';

declare global {
  namespace NodeJS {
    interface Global {
      ipcRenderer: IpcRenderer;
    }
  }
}

// Since we disabled nodeIntegration we can reintroduce
// needed node functionality here
process.once('loaded', () => {
  global.ipcRenderer = ipcRenderer;
});

contextBridge.exposeInMainWorld('api', {
  message: async <T extends ApiActions>(type: T, arg: ApiRequest<T>) =>
    await ipcRenderer.invoke('message', [type, arg]),
  on: (channel: any, callback: any) => ipcRenderer.on(channel, callback),
});
