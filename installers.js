const electronInstaller = require('electron-winstaller');
const path = require('path');

const appDirectory = path.join(__dirname, 'out\\bce-win32-x64');
const outputDirectory = path.join(__dirname, 'installers');
const iconPath = path.join(__dirname, 'logo-FAR.ico');

console.log('Chemin de l\'icône :', iconPath);

electronInstaller.createWindowsInstaller({
    appDirectory: appDirectory,
    outputDirectory: outputDirectory,
    authors: 'ARRASS',
    exe: 'bce.exe',
    iconUrl: 'file://' + iconPath, // URL absolue requise pour Squirrel
    setupIcon: iconPath,
    shortcutIcon: iconPath,
    noMsi: true, // Désactive la création d'un .msi
    setupExe: 'BCE-Setup.exe', // Nom du setup généré
  }).then(() => {
    console.log('Installateur créé avec succès');
  }).catch((err) => {
    console.error('Erreur lors de la création de l\'installateur:', err);
  });
