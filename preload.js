const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    login: (username, password) => ipcRenderer.invoke('login', username, password),
    insertConseiller: (numAE, nomCO, prenomCO, mdpCO) => ipcRenderer.invoke('insertConseiller', numAE, nomCO, prenomCO, mdpCO)
});
