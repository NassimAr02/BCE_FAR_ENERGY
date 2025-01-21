// Appeler la fonction exposee via le preload pour obtenir les données
function selectVueBilan() {
    window.electron.selectVueBilan()  // Appel à l'API exposée par le preload
        .then((data) => {
            console.log('Données reçues:', data);
            const table = document.getElementById("table-body");  // Conteneur du tableau
            table.innerHTML = '';  // Vider les anciens résultats du tableau
            
            // Parcourir et afficher les données
            data.forEach((row) => {
                const tr = document.createElement("tr");
                for (const key in row) {
                    const td = document.createElement("td");
                    td.textContent = row[key];  // Insérer les données dans les cellules
                    tr.appendChild(td);
                }
                table.appendChild(tr);  // Ajouter la ligne au tableau
            });
        })
        .catch((error) => {
            console.error('Erreur lors de la récupération des données:', error);
        });
}

// Appeler la fonction pour remplir le tableau dès que la page est chargée
window.onload = selectVueBilan;
