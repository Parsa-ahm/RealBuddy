const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  readJSON:  (name)       => ipcRenderer.invoke('read-json',  name),
  writeJSON: (name, data) => ipcRenderer.invoke('write-json', name, data)
})
