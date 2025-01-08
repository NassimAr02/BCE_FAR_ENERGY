const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    login: (username, password) => ipcRenderer.invoke('login', username, password),
    insertConseiller: (nomCO, prenomCO, mdpCO) => ipcRenderer.invoke('insertConseiller', nomCO, prenomCO, mdpCO)
});
