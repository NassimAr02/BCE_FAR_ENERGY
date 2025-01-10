document.addEventListener("DOMContentLoaded", () => {
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
  
    // Fonction pour insérer un client
    async function insertClient() {
        let SIRET = document.getElementById('SIRET').value;
        let raisonSociale = document.getElementById('raisonSociale').value;
        let adresse = document.getElementById('adresse').value;
        let secteurActivite = document.getElementById('secteurActivite').value;
        let effectifEntreprise = document.getElementById('effectifEntreprise').value;
        let horaireOuverture = document.getElementById('horaireOuverture').value;
        let dateCreation = document.getElementById('dateCreation').value;
        let consommationAnnuelle = document.getElementById('consommationAnnuelle').value;
        let proprieteMur = document.querySelector('input[name="proprieteMur"]:checked').value;
        let dureeAmortissement = document.getElementById('dureeAmortissement').value;
        let depenseElec = document.getElementById('depenseElec').value;
        let natureProjet = document.getElementById('natureProjet').value;
        let puissanceCompteur = document.getElementById("puissanceCompteur").value;
        let ampérage = document.getElementById("ampérage").value;
        let pointLivraison = document.getElementById("pointLivraison").value;
        let typeCourant = document.getElementById("typeCourant").value;
  
        try {
            await window.electron.insertClient(
              SIRET,raisonSociale,adresse,secteurActivite,effectifEntreprise,horaireOuverture,
              dateCreation,consommationAnnuelle,proprieteMur,dureeAmortissement,
              depenseElec,natureProjet,puissanceCompteur,ampérage,pointLivraison,typeCourant
            );
            console.log("Client inséré avec succès !");
        } catch (err) {
            console.error('Erreur lors de l\'insertion du client :', err);
            throw new Error("Échec de l'insertion du client.");
        }
    }
  
    let numSIRET;
    // Fonction pour insérer un représentant
    async function insertRepresentantClient() {
        let SIRET = document.getElementById('SIRET').value;
        let nomR = document.getElementById('nomR').value;
        let prenomR = document.getElementById('prenomR').value;
        let telR = document.getElementById('telR').value;
        let emailR = document.getElementById('emailR').value;
  
        try {
            await window.electron.insertRepresentantClient(SIRET, nomR, prenomR, telR, emailR);
            numSIRET = SIRET;
            console.log("Représentant inséré avec succès !");
        } catch (err) {
            console.error('Erreur lors de l\'insertion du représentant :', err);
            throw new Error("Échec de l'insertion du représentant.");
        }
    }
  
    // Soumission du formulaire
    document.querySelector(".btn-submit").addEventListener("click", async (event) => {
        event.preventDefault();
        try {
            // Insertion du client, puis du représentant
            await insertClient();
            await insertRepresentantClient();
            alert("Formulaire soumis avec succès !");
            window.location.href = `suiteBilan.html?siret=${encodeURIComponent(numSIRET)}`;
        } catch (err) {
            alert(err.message);
        }
    });
  });
  