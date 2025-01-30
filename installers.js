const electronInstaller = require('electron-winstaller');
const path = require('path')
// Chemin de ton répertoire où se trouve l'application compilée
const appDirectory = path.join(__dirname, 'out\\bce-win32-x64'); // Ajuste ce chemin si nécessaire

// Chemin où tu veux générer l'installateur
const outputDirectory = path.join(__dirname, 'installers'); // Dossier de sortie pour l'installateur

// Détails de l'installateur, y compris l'icône

const iconPath = path.join(__dirname, 'logo-FAR.ico');
console.log('Chemin de l\'icône :', iconPath);
electronInstaller.createWindowsInstaller({
    appDirectory: appDirectory,
    outputDirectory: outputDirectory,
    authors: 'ARRASS', // Remplace par ton nom ou ton entreprise
    exe: 'bce.exe',  // Nom de ton exécutable
    icon: iconPath // Icône de l'application
  }).then(() => {
    console.log('Installateur créé avec succès');
  }).catch((err) => {
    console.error('Erreur lors de la création de l\'installateur:', err);
  });