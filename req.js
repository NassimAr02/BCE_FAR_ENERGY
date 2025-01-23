async function insertBilanSimulation(consoKwH,montantGlobal,abo_conso,partAcheminement,CTA_CSPE,TVA,necessite,
    motivationProjet,refusProjet,prixKwH2024,prixKwH2030,prixKwH2035,montantGlobalTA,capaciteProd,
    puissanceInsta,coutPanneau,coutBatterie,primeAutoCo,RAC,economie25a,SIRET){
    const req = dbBCE.prepare('INSERT INTO bilanSimulation(consoKwH,montantGlobal,abo_conso,partAcheminement,CTA_CSPE,TVA,necessite,motivationProjet,refusProjet,prixKwH2024,prixKwH2030,prixKwH2035,montantGlobalTA,capaciteProd,puissanceInsta,coutPanneau,coutBatterie,primeAutoCo,RAC,economie25a,SIRET,numCo) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)')
    req.run(consoKwH,montantGlobal,abo_conso,partAcheminement,CTA_CSPE,TVA,necessite,
        motivationProjet,refusProjet,prixKwH2024,prixKwH2030,prixKwH2035,montantGlobalTA,capaciteProd,
        puissanceInsta,coutPanneau,coutBatterie,primeAutoCo,RAC,economie25a,SIRET,numCon)
}

ipcMain.handle('insertBilanSimulation',async(event,consoKwH,montantGlobal,abo_conso,partAcheminement,CTA_CSPE,TVA,necessite,
    motivationProjet,refusProjet,prixKwH2024,prixKwH2030,prixKwH2035,montantGlobalTA,capaciteProd,
    puissanceInsta,coutPanneau,coutBatterie,primeAutoCo,RAC,economie25a,SIRET)=>{
    try {
        await insertBilanSimulation(consoKwH,montantGlobal,abo_conso,partAcheminement,CTA_CSPE,TVA,necessite,
            motivationProjet,refusProjet,prixKwH2024,prixKwH2030,prixKwH2035,montantGlobalTA,capaciteProd,
            puissanceInsta,coutPanneau,coutBatterie,primeAutoCo,RAC,economie25a,SIRET)
        return 'Bilan ajouté avec succès';
    } catch(err){
        console.error('Erreur lors de l\'insertion du bilan : ',err)
        throw new Error('Erreur lors de l\'ajout du bilan') 
    }
})