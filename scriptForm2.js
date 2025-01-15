const Chart = require('chart.js');

document.addEventListener("DOMContentLoaded", () => {
    const steps = document.querySelectorAll(".step");
    const forms = document.querySelectorAll(".form");
    const nextButtons = document.querySelectorAll(".btn-next");
    const prevButtons = document.querySelectorAll(".btn-prev");
    const stepContainer = document.querySelector(".step-container");
    const items = document.querySelectorAll(".items");
    let currentStep = 0;

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

    const url = new URL(window.location.href);
    const SIRET = url.searchParams.get("siret")
    async function insertBilan(){
        let necessite = document.getElementById("besoin").value;
        let consActuelle = document.getElementById("consActuelle").value;
        let montantGlobal = document.getElementById("montantGlobal").value;
        let abo_Conso = document.getElementById("abo_conso").value;
        let partAcheminement = document.getElementById("partAcheminement").value;
        let CTA_CSPE = document.getElementById("CTA_CSPE").value;
        let TVA = document.getElementById("TVA").value;
        let montantGlobalTA = document.getElementById("montantGlobalTA").value;
        let motivationProjet = document.getElementById("motivationProjet").value;
        let refusProjet = document.getElementById("refusProjet").value;
        
        try {
            await window.electron.insertBilan(necessite ,consActuelle, consoKwH, montantGlobal, abo_Conso,partAcheminement,
                CTA_CSPE,TVA,montantGlobalTA,motivationProjet,refusProjet,SIRET);
            console.log("Bilan inséré avec succès");
        } catch (err) {
            console.error('Erreur lors de l\'insertion du bilan :', err);
            throw new Error("Echec de l'insertion du bilan");
        }

    }
    async function insertSimulationClient() {
        let prixKwH2024 = document.getElementById("prixKwH2024").value;
        let prixKwH2030 = document.getElementById("prixKwH2030").value;
        let prixKwH2035 = document.getElementById("prixKwH2035").value;
        let montant10A =  document.getElementById("montant10A").value;
        let capacitéProd = document.getElementById("capaciteProduction").value;
        let puissanceInsta = document.getElementById("puisInsta").value;
        let coutPanneau = document.getElementById("nbPanneau").value;
        let coutBatterie = document.getElementById("nbBatterie").value;
        let primeAutoCo = document.getElementById("primeAutoC").value;
        let RAC = document.getElementById("racTVA").value;
        let racHT = document.getElementById("racHT").value;
        

        try {
            await window.electron.insertSimulationClient(prixKwH2024,prixKwH2030,prixKwH2035,montant10A,capacitéProd
                ,puissanceInsta,coutPanneau,coutBatterie,primeAutoCo,RAC,racHT
            )
            console.log("Simulation Client ajouté avec succès");
        } catch (err) {
            console.error('Erreur lors de l\'insertion de la simulation client : ',err);
            throw new Error("Echec de l'insertion de la simulation client")
        }
    }
    function genererGraphique() {
        let factAct = document.getElementById("factAct").value;
        let fact2030 = document.getElementById("fact2030").value;
        let fact2035 =document.getElementById("fact2035").value;
        let coutMoyen = (parseFloat(factAct) + parseFloat(fact2030) + parseFloat(fact2035))/3
    }
    // Soumission du formulaire
    document.querySelector(".btn-submit").addEventListener("click", async (event) => {
        event.preventDefault();
        try {
            // Insertion du client, puis du représentant
            await insertBilan();
            await insertSimulationClient();
            alert("Formulaire soumis avec succès !");
            window.location.href = `suiteBilan.html?siret=${encodeURIComponent(numSIRET)}`;
        } catch (err) {
            alert(err.message);
        }
    });
});

