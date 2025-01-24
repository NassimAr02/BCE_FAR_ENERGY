const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    receiveData: (callback) => ipcRenderer.on('send-data', callback),
    login: (username, password) => ipcRenderer.invoke('login', username, password),
    insertConseiller: (nomCO, prenomCO, mdpCO) => ipcRenderer.invoke('insertConseiller', nomCO, prenomCO, mdpCO),
    insertClient: (SIRET, raisonSociale, adresse, secteurActivite, effectifEntreprise, horaireOuverture,
        dateCreation, consommationAnnuelle, proprieteMur, dureeAmortissement, depenseElec,
        natureProjet, puissanceCompteur, ampérage, pointLivraison, typeCourant) => ipcRenderer.invoke("insertClient", SIRET, raisonSociale, adresse, secteurActivite, effectifEntreprise,
        horaireOuverture, dateCreation, consommationAnnuelle, proprieteMur, dureeAmortissement, depenseElec,
        natureProjet, puissanceCompteur, ampérage, pointLivraison, typeCourant),
    insertRepresentantClient: (SIRET,nomR,prenomR,telR,emailR) => ipcRenderer.invoke("insertRepresentantClient",SIRET,nomR,prenomR,telR,emailR), 
    insertBilanSimulation: (consoKwH,montantGlobal,abo_conso,partAcheminement,CTA_CSPE,TVA,necessite,
        motivationProjet,refusProjet,prixKwH2024,prixKwH2030,prixKwH2035,montantGlobalTA,capaciteProd,
        puissanceInsta,coutPanneau,coutBatterie,primeAutoCo,RAC,economie25a,SIRET) => ipcRenderer.invoke("insertBilanSimulation",consoKwH,montantGlobal,abo_conso,partAcheminement,CTA_CSPE,TVA,necessite,motivationProjet,refusProjet,prixKwH2024,prixKwH2030,prixKwH2035,montantGlobalTA,capaciteProd,puissanceInsta,coutPanneau,coutBatterie,primeAutoCo,RAC,economie25a,SIRET),
    openLink: (url) => {
        console.log('URL envoyée à openLink :', url);
        ipcRenderer.send('open-link', url);
    },
    genererChart: (factAct, fact2030, fact2035, consActuelle, MTA, capaciteProduction, prixC, prix2030, prix2035, racTVA) => {
        return ipcRenderer.invoke("genererChart", factAct, fact2030, fact2035, consActuelle, MTA, capaciteProduction, prixC, prix2030, prix2035, racTVA);
    },
    selectVueBilan: () => ipcRenderer.invoke("selectVueBilan"),
    selectBilanSimulation: (SIRET,numCO) => ipcRenderer.invoke("selectBilanSimulation",SIRET,numCO)
});
