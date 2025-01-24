function selectVueBilan() {
    window.electron.selectVueBilan() // Appel à l'API exposée par le preload
        .then((data) => {
            console.log('Données reçues:', data);
            const table = document.getElementById("table-body"); // Conteneur du tableau
            table.innerHTML = ''; // Vider les anciens résultats du tableau

            // Parcourir et afficher les données
            data.forEach((row) => {
                const tr = document.createElement("tr"); // Créer une nouvelle ligne

                // Ajouter les colonnes SIRET, raisonSociale, dateBilan, montantGlobal, necessite
                Object.keys(row).forEach((key) => {
                    if (key !== "numCO") { // Exclure la colonne numCO si nécessaire
                        const td = document.createElement("td");
                        td.textContent = row[key]; // Ajouter le contenu de la cellule
                        tr.appendChild(td); // Ajouter la cellule à la ligne
                    }
                });

                // Ajouter une colonne "Action" avec un bouton
                const actionTd = document.createElement("td");
                const actionButton = document.createElement("button");
                actionButton.innerHTML = "<i class='fas fa-pencil'></i>";
                actionButton.onclick = () => {
                    window.location.href = `consulteBilan.html?siret=${encodeURIComponent(row.SIRET)}&numCO=${encodeURIComponent(row.numCO)}`;
                };
                actionTd.appendChild(actionButton); // Ajouter le bouton à la cellule
                tr.appendChild(actionTd); // Ajouter la cellule à la ligne

                // Ajouter la ligne au tableau
                table.appendChild(tr);
            });
        })
        .catch((error) => {
            console.error('Erreur lors de la récupération des données:', error);
        });
}

// Appeler la fonction pour remplir le tableau dès que la page est chargée
window.onload = selectVueBilan;
