const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    login: (username, password) => ipcRenderer.invoke('login', username, password),
    insertConseiller: (nomCO, prenomCO, mdpCO) => ipcRenderer.invoke('insertConseiller', nomCO, prenomCO, mdpCO),
    insertClient: (SIRET,raisonSociale,adresse,secteurActivite,effectifEntreprise,
        horaireOuverture,dateCreation,consommationAnnuelle,proprieteMur,dureeAmortissement,dépenseElec,
        natureProjet,puissanceCompteur,ampérage,pointLivraison,typeCourant) => ipcRenderer.invoke("insertClient",SIRET,raisonSociale,adresse,secteurActivite,effectifEntreprise,
        horaireOuverture,dateCreation,consommationAnnuelle,proprieteMur,dureeAmortissement,dépenseElec,
        natureProjet,puissanceCompteur,ampérage,pointLivraison,typeCourant),
    insertRepresentantClient: (SIRET,nomR,prenomR,telR,emailR) => ipcRenderer.invoke("insertRepresentantClient",SIRET,nomR,prenomR,telR,emailR)
});
