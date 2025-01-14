const { ipcRenderer } = require('electron');

// Écoutez l'événement 'send-data' du Main Process
ipcRenderer.on('send-data', (event, data) => {
    // Affichez les données dans la console du navigateur
    console.log(`Données de la table ${data.tableName}:`, data.rows);
});
// renderer.js
document.getElementById('openTabButton').addEventListener('click', function() {
    window.electron.openLink('https://re.jrc.ec.europa.eu/pvg_tools/fr/');
});

// const Chart = require('chart.js'); // Charger Chart.js localement

// document.addEventListener('DOMContentLoaded', () => {
//     const generateButton = document.getElementById('generateChart');
    
//     generateButton.addEventListener('click', () => {
//         generateChart();
//     });

//     function generateChart() {
//         const ctx = document.getElementById('myChart').getContext('2d');
//         const chart = new Chart(ctx, {
//             type: 'line', // Type de graphique : ligne
//             data: {
//                 labels: ['Courant', '2030', '2035'], // Labels pour les différentes années
//                 datasets: [
//                     {
//                         label: 'Coût Mensuel Courant (€)',
//                         data: [120, 130, 140], // Données pour la première ligne
//                         borderColor: 'rgba(0, 123, 255, 1)', // Couleur de la ligne
//                         backgroundColor: 'rgba(0, 123, 255, 0.2)', // Couleur de fond sous la ligne
//                         fill: true, // Remplir sous la ligne
//                         tension: 0.4, // Courbure de la ligne
//                         borderWidth: 2
//                     },
//                     {
//                         label: 'Coût Mensuel 2030 (€)',
//                         data: [150, 160, 170], // Données pour la deuxième ligne
//                         borderColor: 'rgba(40, 167, 69, 1)', // Couleur de la ligne
//                         backgroundColor: 'rgba(40, 167, 69, 0.2)', // Couleur de fond sous la ligne
//                         fill: true, // Remplir sous la ligne
//                         tension: 0.4, // Courbure de la ligne
//                         borderWidth: 2
//                     }
//                 ]
//             },
//             options: {
//                 responsive: true,
//                 scales: {
//                     y: {
//                         beginAtZero: true // Commence l'axe Y à zéro
//                     }
//                 }
//             }
//         });
//     }
// });

