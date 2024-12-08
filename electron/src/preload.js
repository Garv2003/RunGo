const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  runGoCode: async (code) => {
    console.log('Sending code to main process:', code)
    const result = await ipcRenderer.invoke('run-go-code', code)
    console.log('Got result:', result)
    return result
  }
})
