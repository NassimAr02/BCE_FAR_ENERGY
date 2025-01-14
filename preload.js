const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    receiveData: (callback) => ipcRenderer.on('send-data', callback),
    login: (username, password) => ipcRenderer.invoke('login', username, password),
    insertConseiller: (nomCO, prenomCO, mdpCO) => ipcRenderer.invoke('insertConseiller', nomCO, prenomCO, mdpCO),
    insertClient: (SIRET,raisonSociale,adresse,secteurActivite,effectifEntreprise,
        horaireOuverture,dateCreation,consommationAnnuelle,proprieteMur,dureeAmortissement,dépenseElec,
        natureProjet,puissanceCompteur,ampérage,pointLivraison,typeCourant) => ipcRenderer.invoke("insertClient",SIRET,raisonSociale,adresse,secteurActivite,effectifEntreprise,
        horaireOuverture,dateCreation,consommationAnnuelle,proprieteMur,dureeAmortissement,dépenseElec,
        natureProjet,puissanceCompteur,ampérage,pointLivraison,typeCourant),
    insertRepresentantClient: (SIRET,nomR,prenomR,telR,emailR) => ipcRenderer.invoke("insertRepresentantClient",SIRET,nomR,prenomR,telR,emailR),
    insertBilan: (necessite,consoKwH,montantGlobal,abo_conso,partAcheminement,CTA_CSPE,TVA,motivationProjet,refusProjet,SIRET) => ipcRenderer.invoke("insertBilan",necessite,consoKwH,montantGlobal,abo_conso,partAcheminement,CTA_CSPE,TVA,motivationProjet,refusProjet,SIRET),
    openLink: (url) => ipcRenderer.send('open-link', url)
});
