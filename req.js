

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
    async function remplirChampBS(SIRET,numCO){
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
        let besoin = document.getElementById("besoin");
        
    }
    document.querySelector(".btn-submit").addEventListener("click", async (event) => {
        event.preventDefault();
        try {

            // Insertion du client, puis du représentant
            const url = new URL(window.location.href);
            const SIRET = url.searchParams.get("siret");
            const numCO = url.searchParams.get("numCO");

            await remplirChampBS(SIRET,numCO);
            window.location.href = 'acceuilConnecté.html';
        } catch (err) {
            alert(err.message);
        }
    });
});