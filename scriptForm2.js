

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


    async function insertBilan(){
        let necessite = document.querySelector("input[name='besoin']:checked").value;
        let consoKwH = document.getElementById("consActuelle").value;
        let montantGlobal = document.getElementById("montantGlobal").value;
        let abo_Conso = document.getElementById("abo_conso").value;
        let partAcheminement = document.getElementById("partAcheminement").value;
        let CTA_CSPE = document.getElementById("CTA_CSPE").value;
        let TVA = document.getElementById("TVA").value;
        let montantGlobalTA = document.getElementById("montantGlobalTot").value;
        let motivationProjet = document.getElementById("motivationProjet").value;
        let refusProjet = document.getElementById("refusProjet").value;
        const url = new URL(window.location.href);
        const SIRET = url.searchParams.get("siret")
        console.log("Numéro de Siret : ", SIRET,' ', necessite, ' ',consActuelle,' ',montantGlobal,' ',abo_Conso,' ',partAcheminement,' ', CTA_CSPE,' ', TVA, ' ',montantGlobalTA,' ',motivationProjet,' ',refusProjet);
        try {
            await window.electron.insertBilan(necessite,consoKwH,montantGlobal,abo_Conso,partAcheminement,CTA_CSPE,TVA,montantGlobalTA,motivationProjet,refusProjet,SIRET);
            console.log("Bilan inséré avec succès");
        } catch (err) {
            console.error('Erreur lors de l\'insertion du bilan :', err);
            throw new Error("Echec de l'insertion du bilan"); 
        }

    }
    async function insertSimulationClient() {
        let prixKwH2024 = document.getElementById("prixCourant").value;
        let prixKwH2030 = document.getElementById("prix2030").value;
        let prixKwH2035 = document.getElementById("prix2035").value;
        let montant10A =  document.getElementById("montantTaxes10").value;
        let capacitéProd = document.getElementById("capaciteProduction").value;
        let puissanceInsta = document.getElementById("puisInsta").value;
        let coutPanneau = document.getElementById("nbPanneau").value;
        let coutBatterie = document.getElementById("nbBatterie").value;
        let primeAutoCo = document.getElementById("primeAutoC").value;
        let RAC = document.getElementById("racTVA").value;
        let economie25a = document.getElementById("economie25a").value;
        const url = new URL(window.location.href);
        const SIRET = url.searchParams.get("siret");

        
        try {
            let numBilan = window.electron.selectNumBilan(SIRET);
            console.log(prixKwH2024,' ',prixKwH2030,' ',prixKwH2035,' ',montant10A,' ',capacitéProd,' ',puissanceInsta,' ',coutPanneau,' ',coutBatterie,' ',primeAutoCo,' ',RAC,' ',economie25a,' ',numBilan);
            if (!numBilan) {
                console.error("Aucun numéro de bilan trouvé.");
                alert("Erreur : Aucun bilan trouvé pour ce SIRET.");
                return;
            }
            window.electron.insertSimulationClient(prixKwH2024,prixKwH2030,prixKwH2035,montant10A,capacitéProd,puissanceInsta,coutPanneau,coutBatterie,primeAutoCo,RAC,economie25a,numBilan)
            console.log("Simulation Client ajouté avec succès");
        } catch (err) {
            console.error('Erreur lors de l\'insertion de la simulation client : ',err);
            throw new Error("Echec de l'insertion de la simulation client")
        }
    }
    
    
    // Soumission du formulaire
    document.querySelector(".btn-submit").addEventListener("click", async (event) => {
        event.preventDefault();
        try {
            // Insertion du client, puis du représentant
            await insertBilan();
            await insertSimulationClient();
            window.location.href = 'acceuilConnecté.html';
        } catch (err) {
            alert(err.message);
        }
    });
});

