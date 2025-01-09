const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    login: (username, password) => ipcRenderer.invoke('login', username, password),
    insertConseiller: (nomCO, prenomCO, mdpCO) => ipcRenderer.invoke('insertConseiller', nomCO, prenomCO, mdpCO),
    insertClient: (SIRET,raisonSociale,adresse,secteurActivite,effectifEntreprise,horaireOuverture,dateCreation,consommationAnnuelle,proprieteMur,dureeAmortissement,dépenseElec,natureProjet) => ipcRenderer.invoke("insertClient",SIRET,raisonSociale,adresse,secteurActivite,effectifEntreprise,horaireOuverture,dateCreation,consommationAnnuelle,proprieteMur,dureeAmortissement,dépenseElec,natureProjet),
    insertRepresentantClient: (SIRET,nomR,prenomR,telR,emailR) => ipcRenderer.invoke("insertRepresentantClient",SIRET,nomR,prenomR,telR,emailR)
});
