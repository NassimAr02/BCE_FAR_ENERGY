document.addEventListener("DOMContentLoaded",async () => {
    const steps = document.querySelectorAll(".step");
    const forms = document.querySelectorAll(".form");
    const nextButtons = document.querySelectorAll(".btn-next");
    const prevButtons = document.querySelectorAll(".btn-prev");
    const stepContainer = document.querySelector(".step-container");
    const items = document.querySelectorAll(".items");
    let currentStep = 0;
    const url = new URL(window.location.href);
    const SIRET = url.searchParams.get("siret");
    const numCO = url.searchParams.get("numCO");
    await remplirChampBS(SIRET,numCO);

    const updateStep = (step) => {
        steps.forEach((stepEl, index) => {
            stepEl.classList.toggle("step-active", index === step);
        });
        forms.forEach((formEl, index) => {
            formEl.classList.toggle("form-active", index === step);
        });

        // Ajuster la largeur du fieldset pour l'étape 2
        if ((step === 1) || (step === 3)) {
            stepContainer.classList.add("wide");
        } else {
            stepContainer.classList.remove("wide");
        }
        
    };

    nextButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            if (currentStep < steps.length - 1) {
                currentStep++;
                updateStep(currentStep);
            }
        });
    });

    prevButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            if (currentStep > 0) {
                currentStep--;
                updateStep(currentStep);
            }
        });
    });
    async function remplirChampBS(SIRET,numCO){
        let analyseFactureOui = document.getElementById("analyseFactureOui");
        let analyseFactureNon = document.getElementById("analyseFactureNon");
        let consoKwH = document.getElementById("consoKwH");
        let montantGlobal = document.getElementById("montantGlobal");
        let abo_conso = document.getElementById("abo_conso");
        let partAcheminement = document.getElementById("partAcheminement");
        let CTA_CSPE = document.getElementById("CTA_CSPE");
        let TVA = document.getElementById("TVA");
        let montantGlobalTA = document.getElementById("montantGlobalTot");
        let prixCourant = document.getElementById("prixCourant");
        let prix2030 = document.getElementById("prix2030");
        let prix2035 = document.getElementById("prix2035");
        let besoinOui = document.getElementById("besoinOui");
        let besoinNon =  document.getElementById("besoinNon");
        let motivationProjet = document.getElementById("motivationProjet");
        let refusProjet = document.getElementById("refusProjet");
        let capaciteProd = document.getElementById("capaciteProduction");
        let puissanceInsta = document.getElementById("puisInsta");
        
        let nbPanneau = document.getElementById("nbPanneau");
        let nbBatterie = document.getElementById("nbBatterie");
        let primeAutoCo=document.getElementById("primeAutoC");

        try {
            const dataSimulation = await window.electron.selectBilanSimulation(numCO,SIRET);
            // console.log("Données récupérées : ", dataSimulation);

            if (dataSimulation && dataSimulation.length > 0) {
                const data = dataSimulation[0];
                if(data.analyseFacture == 1) {
                    analyseFactureOui.checked =true 
                } else {
                    analyseFactureNon.checked =true
                }
                
                consoKwH.value = data.consoKwH;
                montantGlobal.value = data.montantGlobal;
                abo_conso.value=data.abo_Conso;
                partAcheminement.value = data.partAcheminement;
                CTA_CSPE.value = data.CTA_CSPE;
                TVA.value = data.TVA;
                montantGlobalTA.value = data.montantGlobalTA;
                prixCourant.value= data.prixKwH2024;
                prix2030.value=data.prixKwH2030;
                prix2035.value = data.prixKwH2035;

                if (data.necessite == 1) {
                    besoinOui.checked=true;
                } else {
                    besoinNon.checked=true;
                }
                motivationProjet.value=data.motivationProjet;
                refusProjet.value=data.refusProjet;
                capaciteProd.value=data.capaciteProd;
                puissanceInsta.value=data.puissanceInsta;
                nbBatterie.value=data.coutBatterie;
                nbPanneau.value=data.coutPanneau;
                primeAutoCo.value=data.primeAutoCo;
            } else {
            console.warn("Aucune donnée simulation trouvée pour SIRET :", SIRET,' ',numCO);
        }
        } catch (err) {
            console.error("Erreur dans remplirChampBS() : ", err);
        }

        document.getElementById("consActuelle").value=consoKwH.value;
                const consoKwH2 =parseFloat(document.getElementById('consoKwH').value)
                const prixC = parseFloat(document.getElementById('prixCourant').value)
                const prix2030a =parseFloat(document.getElementById('prix2030').value)
                const prix2035a =parseFloat(document.getElementById('prix2035').value)

                document.getElementById('mensuelCourant').value = ((consoKwH2*prixC)/12).toFixed(2)
                document.getElementById('mensuel2030').value = ((consoKwH2*prix2030a)/12).toFixed(2)
                document.getElementById('mensuel2035').value = ((consoKwH2*prix2035a)/12).toFixed(2)

                document.getElementById('annuelCourant').value = (consoKwH2 * prixC).toFixed(2)
                document.getElementById('annuel2030').value =(consoKwH2 * prix2030a).toFixed(2)
                document.getElementById('annuel2035').value = (consoKwH2 * prix2035a).toFixed(2)
                const montantTaxes10 = document.getElementById("montantTaxes10");
                montantTaxes10.value = (parseFloat(montantGlobalTA.value) * 10).toFixed(2)

                const consActuelle = parseFloat(document.getElementById('consActuelle').value)
                const factAct =document.getElementById('factAct')
                const fact2030 = document.getElementById('fact2030')
                const fact2035 = document.getElementById('fact2035')
                

                factAct.value = (consActuelle * prixC).toFixed(2)
                fact2030.value = (consActuelle * prix2030a).toFixed(2)
                fact2035.value =(consActuelle * prix2035a).toFixed(2)
                const moyenne = (parseFloat(factAct.value) + parseFloat(fact2030.value) + parseFloat(fact2035.value)) / 3;
                document.getElementById('cout10').value = (moyenne*10).toFixed(2)

                const racTVA = document.getElementById('racTVA')
                
                const primeAutoC = parseFloat(document.getElementById('primeAutoC').value) || 0
                
                document.getElementById('coutGlobale').value = (parseFloat(nbBatterie.value) + parseFloat(nbPanneau.value)).toFixed(2)
                const coutGlobale = parseFloat(document.getElementById('coutGlobale').value) || 0
                const racTVAvalue = coutGlobale - primeAutoC
                racTVA.value = racTVAvalue.toFixed(2) 
                const racHT = document.getElementById('racHT')
                const racHTvalue = racTVAvalue*0.8
                racHT.value = racHTvalue.toFixed(2)
                const economie25a = document.getElementById('economie25a')
                let prixMoyen = (parseFloat(prixC) + parseFloat(prix2030a) + parseFloat(prix2035a))/ 3;
                const capaciteProduction = parseFloat(document.getElementById("capaciteProduction").value);
                economie25a.value = ((prixMoyen * capaciteProduction) * 25).toFixed(2);
                
    }   
    
    document.querySelector(".btn-submit").addEventListener("click", async (event) => {
        event.preventDefault();
        
            window.location.href = 'acceuilConnecté.html';
    });
});  