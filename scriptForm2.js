

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


    async function insertBilanSimulation(){
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
        let prixKwH2024 = document.getElementById("prixCourant").value;
        let prixKwH2030 = document.getElementById("prix2030").value;
        let prixKwH2035 = document.getElementById("prix2035").value;
        let capacitéProd = document.getElementById("capaciteProduction").value;
        let puissanceInsta = document.getElementById("puisInsta").value;
        let coutPanneau = document.getElementById("nbPanneau").value;
        let coutBatterie = document.getElementById("nbBatterie").value;
        let primeAutoCo = document.getElementById("primeAutoC").value;
        let RAC = document.getElementById("racTVA").value;
        let economie25a = document.getElementById("economie25a").value;
        const url = new URL(window.location.href);
        const SIRET = url.searchParams.get("siret")
        // console.log("Numéro de Siret : ", SIRET,' ', consoKwH, ' ',montantGlobal,' ',abo_Conso,' ',partAcheminement,' ',CTA_CSPE,' ',TVA,' ',necessite,
        //     motivationProjet,' ',refusProjet,' ',prixKwH2024,' ',prixKwH2030,' ',prixKwH2035,' ',montantGlobalTA,' ',capacitéProd,' ',
        //     puissanceInsta,' ',coutPanneau,' ',coutBatterie,' ',primeAutoCo,' ',RAC,' ',economie25a);
        try {
            await window.electron.insertBilanSimulation(consoKwH,montantGlobal,abo_Conso,partAcheminement,CTA_CSPE,TVA,necessite,
                motivationProjet,refusProjet,prixKwH2024,prixKwH2030,prixKwH2035,montantGlobalTA,capacitéProd,
                puissanceInsta,coutPanneau,coutBatterie,primeAutoCo,RAC,economie25a,SIRET);
            console.log("Bilan inséré avec succès");
        } catch (err) {
            console.error('Erreur lors de l\'insertion du bilan :', err);
            throw new Error("Echec de l'insertion du bilan"); 
        }

    }
    document.getElementById("calculeProd").addEventListener("click", async () => {
        let adresseClient = document.getElementById("adresseClient").value;
        if (!adresseClient) {
            alert("Veuillez entrer une adresse.");
            return;
        }
        try{
            const coordonnées = await window.electron.getCoordonnee(adresseClient)
            let lat = coordonnées.lat;
            let lon = coordonnées.lon;
            await recupDonnee(lat, lon);
        } catch(error) {
            console.error("Erreur lors de la récupération des coordonnées :", error);
            alert("Impossible d'obtenir les coordonnées. Vérifiez l'adresse.");
        }
        
    })
    async function recupDonnee(lat,lon) {
        let typePS = document.getElementById("typePS").value;
        let puisKwP = document.getElementById("puisKwP").value;
        let perteSy = document.getElementById("perteSy").value;
        let posMontage = document.getElementById("posMontage").value;
        let incl = document.getElementById("incl").value;
        let azimut = document.getElementById("azimut").value;
        let optiIncl1 = document.getElementById("optiIncl1").value;
        let optiIncl2 = document.getElementById("optiIncl2").value;

        if (!typePS || !puisKwP || !perteSy || !posMontage || !incl || !azimut || !optiIncl1 || !optiIncl2) {
            alert("Veuillez remplir tous les champs.");
            return;
        }
        try {
            const capaciteProd = await window.electron.getCapaciteProd(lat,lon,typePS,puisKwP,perteSy,posMontage,incl,azimut,optiIncl1,optiIncl2);
            console.log(capaciteProd.data);
        } catch(error){
            console.error("Erreur lors de la récupération des données :", error);
            alert("Impossible de récupérer la capacité de production.");
        }
        
    }
    
    // Soumission du formulaire
    document.querySelector(".btn-submit").addEventListener("click", async (event) => {
        event.preventDefault();
        try {

            // Insertion du client, puis du représentant

            await insertBilanSimulation();
            window.location.href = 'acceuilConnecté.html';
        } catch (err) {
            alert(err.message);
        }
    });
});

