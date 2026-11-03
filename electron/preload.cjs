const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('simappDesktop', {
  saveJson: (key, value) => ipcRenderer.invoke('storage:save-json', { key, value }),
  getJson: (key) => ipcRenderer.invoke('storage:get-json', key),
  deleteJson: (key) => ipcRenderer.invoke('storage:delete-json', key),
  saveRecording: (payload) => ipcRenderer.invoke('recording:save', payload),
});
