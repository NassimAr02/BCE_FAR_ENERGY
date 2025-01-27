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
        console.log(numCO, SIRET, "Données reçues :", RClient);

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

   

    document.getElementById("SIRET").value = SIRET; 
    let raisonSociale = document.getElementById("raisonSociale");
    let adresse = document.getElementById("adresse");
    let secteurActivite = document.getElementById("secteurActivite");
    let effectifEntreprise = document.getElementById("effectifEntreprise");
    let dateCreation = document.getElementById("dateCreation");
    let consommationAnnuelle = document.getElementById("consommationAnnuelle");
    let dureeAmortissement = document.getElementById("dureeAmortissement");
    let depenseElec = document.getElementById("depenseElec");
    let natureProjet = document.getElementById("natureProjet");
    let puissanceCompteur = document.getElementById("puissanceCompteur");
    let ampérage = document.getElementById("ampérage");
    let pointLivraison = document.getElementById("pointLivraison");
    let typeCourant = document.getElementById("typeCourant");
    try {
        const client = await window.electron.selectClient(SIRET);
        console.log(numCO, SIRET, "Données reçues :", client);
        
        if (client && client.length > 0) {
            raisonSociale.value = client.raisonSociale;
            adresse.value = client.adresse;
            secteurActivite.value = client.secteurActivite;
            effectifEntreprise.value = client.effectifEntreprise;
            dateCreation.value = client.dateCreation;
            consommationAnnuelle.value = client.consommationAnnuelle;
            depenseElec.value = client.depenseElec;
            if(client.proprieteMur === 1){
                document.getElementById("proprieteMurOui").checked = true;
            } else if (client.proprieteMur === 0){
                document.getElementById("proprieteMurNon").checked = true;
            }
            dureeAmortissement.value = client.dureeAmortissement;
            depenseElec.value = client.depenseElec;
            const propMur = client.natureProjet;

            const option = natureProjet.querySelector(`option[value="${propMur}"]`);
            if (option){
                natureProjet.value = propMur;
            }  else {
                console.warn("Aucune option correspondante trouvée pour le statut :", propMur);
            }
            puissanceCompteur.value = client.puissanceCompteur;
            ampérage.value = client.amperage
            pointLivraison.value = client.pointLivraison;
            
            const type = client.typeCourant;
            const option2 = typeCourant.querySelector(`option[value="${type}"]`);
            if (option2){
                typeCourant.value = type;
            } else {
                console.warn("Aucune option correspondante trouvée pour le statut :", type);
            }

        }
        
    } catch (error) {
        console.error('Erreur lors de la récupération des données', error);
    }
}
// Exécute la fonction lors du chargement de la page

// Soumission du formulaire
document.querySelector(".btn-submit").addEventListener("click", async (event) => {
    event.preventDefault();
    try {
        const url = new URL(window.location.href);
        const SIRET = url.searchParams.get("siret");
        const numCO = url.searchParams.get("numCO");
        window.location.href = `suiteConsulteBilan.html?siret=${encodeURIComponent(SIRET)}&numCO=${encodeURIComponent(numCO)}`;
    } catch (err) {
        alert(err.message);
    }
});




