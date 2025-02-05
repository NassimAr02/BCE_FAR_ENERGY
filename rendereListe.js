const url = new URL(window.location.href);
const SIRET = url.searchParams.get("siret");
const numCO = url.searchParams.get("numCO");

    document.addEventListener("DOMContentLoaded",async () => {
        
        await remplirChampR(SIRET);
        await remplirChampC(SIRET);

        const steps = document.querySelectorAll(".step");
        const forms = document.querySelectorAll(".form");
        const nextButtons = document.querySelectorAll(".btn-next");
        const prevButtons = document.querySelectorAll(".btn-prev");
    
        let currentStep = 0;
    
        const updateStep = (step) => {
            steps.forEach((stepEl, index) => {
                stepEl.classList.toggle("step-active", index === step);
            });
            forms.forEach((formEl, index) => {
                formEl.classList.toggle("form-active", index === step);
            });
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
})  

async function remplirChampR(SIRET) {
    const loader = document.getElementById("loader");
    loader.style.display = "block"; // Affiche le loader
    

    // Récupération des champs
    let nomR = document.getElementById("nomR");
    let prenomR = document.getElementById("prenomR");
    let telR = document.getElementById("telR");
    let emailR = document.getElementById("emailR");

    try {
        // Récupération des données via Electron
        const RClient = await window.electron.selectRClient(SIRET);

        // Vérifiez si les données sont correctes
        // console.log(numCO, SIRET, "Données reçues :", RClient);

        if (RClient && RClient.length > 0) {
            // Supposons que RClient est un tableau d'objets
            const client = RClient[0];

            // Mise à jour des champs avec les données du premier objet
            nomR.value = client.nomR || '';
            prenomR.value = client.prenomR || '';
            telR.value = client.telR || '';
            emailR.value = client.emailR || '';
        } else {
            console.warn("Aucun client trouvé pour le SIRET :", SIRET);
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des données', error);
    } finally {
        loader.style.display = "none"; // Cache le loader
    }
    
}

async function remplirChampC(SIRET) {
    console.log("Début de remplirChampC avec SIRET :", SIRET);

    const loader = document.getElementById("loader");
    loader.style.display = "block";

    let SIRETField = document.getElementById("SIRET");
    let adresse = document.getElementById("adresse");
    let secteurActivite = document.getElementById("secteurActivite");
    let effectifEntreprise = document.getElementById("effectifEntreprise");
    let horaireOuverture = document.getElementById("horaireOuverture");
    let dateCreation = document.getElementById("dateCreation");
    let raisonSociale = document.getElementById("raisonSociale");

    let natureProjet = document.getElementById("natureProjet");
    let typeCourant = document.getElementById("typeCourant");

    let consommationAnnuelle = document.getElementById("consommationAnnuelle");
    let depenseElec = document.getElementById("depenseElec");
    let dureeAmortissement = document.getElementById("dureeAmortissement");
    let proprieteMurOui = document.getElementById("proprieteMurOui");
    let proprieteMurNon = document.getElementById("proprieteMurNon");

    let puissanceCompteur = document.getElementById("puissanceCompteur");
    let amperage = document.getElementById("ampérage");
    let pointLivraison = document.getElementById("pointLivraison");

    try {
        const ClientData = await window.electron.selectClient(SIRET);
        console.log("Données reçues :", ClientData);

        if (ClientData && ClientData.length > 0) {
            const client = ClientData[0];

            // Champs simples
            SIRETField.value = client.SIRET || '';
            adresse.value = client.adresse || '';
            secteurActivite.value = client.secteurActivite || '';
            effectifEntreprise.value = client.effectifEntreprise || '';
            horaireOuverture.value = client.horaireOuverture || '';
            dateCreation.value = client.dateCreation || '';
            raisonSociale.value = client.raisonSociale || '';

            consommationAnnuelle.value = client.consommationAnnuelle || '';
            depenseElec.value = client.depenseElec || '';
            dureeAmortissement.value = client.dureeAmortissement || '';

            puissanceCompteur.value = client.puissanceCompteur || '';
            amperage.value = client.amperage || '';
            pointLivraison.value = client.pointLivraison || '';

            // Radio button
            if (client.proprieteMur == 1) {
                proprieteMurOui.checked = true;
            } else {
                proprieteMurNon.checked = true;
            }

            // Listes déroulantes
            let projetValue = client.natureProjet.trim();
            const optionNature = natureProjet.querySelector(`option[value="${projetValue}"]`);
            if (optionNature) {
                natureProjet.value = projetValue;
            } else {
                console.warn("Aucune option correspondante trouvée pour natureProjet :", projetValue);
            }

            let courantValue = client.typeCourant.trim();
            const optionCourant = typeCourant.querySelector(`option[value="${courantValue}"]`);
            if (optionCourant) {
                typeCourant.value = courantValue;
            } else {
                console.warn("Aucune option correspondante trouvée pour typeCourant :", courantValue);
            }
        } else {
            console.warn("Aucune donnée client trouvée pour SIRET :", SIRET);
        }
    } catch (error) {
        console.error("Erreur dans remplirChampC :", error);
    } finally {
        loader.style.display = "none";
    }
}

// Exécute la fonction lors du chargement de la page
document.getElementById("Accueil").addEventListener("click",(event) =>{
    event.preventDefault();
    window.location.href = "acceuilConnecte.html";
});
// Soumission du formulaire
document.querySelector(".btn-submit").addEventListener("click", async (event) => {
    event.preventDefault();
    try {
        const url = new URL(window.location.href);
        const SIRET = url.searchParams.get("siret");
        const numCO = url.searchParams.get("numCO");
        window.location.href = `suiteConsulteBilan.html?siret=${encodeURIComponent(SIRET)}&numCO=${encodeURIComponent(numCO)}`;
    } catch (err) {
        window.electron.showMessage(err.message);
    }
});




