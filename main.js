// Modules pour la gestion de l'appli et la création de la BrowserWindow native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const Database = require('better-sqlite3');
const argon2 = require('argon2');

// Déclarez dbBCE en dehors de initDatabase pour qu'elle soit accessible globalement
let dbBCE;

const createWindow = () => {
  // Création de la browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
        nodeIntegration: false,
        contextIsolation: true, 
        preload: path.join(__dirname, 'preload.js')
    }
  })

  // et chargement de l'index.html de l'application.
  mainWindow.loadFile('index.html')

  // Ouvrir les outils de développement.
  // mainWindow.webContents.openDevTools()
  initDatabase();
}

// Fonction pour initialiser la base de données
async function initDatabase() {
    const dbPath = path.join(app.getPath('userData'), "database.sqlite");
    dbBCE = new Database(dbPath);  // Initialisation de dbBCE en dehors de la fonction

    // Créer la table si elle n'existe pas déjà
    dbBCE.exec(`
        DROP TABLE IF EXISTS Conseiller;
        CREATE TABLE IF NOT EXISTS Conseiller(
            numCo INTEGER PRIMARY KEY AUTOINCREMENT,
            nomCo TEXT NOT NULL,
            prenomCo TEXT NOT NULL,
            idCo VARCHAR NOT NULL, 
            mdcCo VARCHAR NOT NULL
        );
    `);

    // Exemple d'ajout de conseiller avec mot de passe haché
    const password = 'monMotDePasse'; // Le mot de passe à hacher
    const hash = await argon2.hash(password); // Hacher le mot de passe

    // Insertion dans la base de données avec mot de passe haché
    const stmt = dbBCE.prepare('INSERT INTO Conseiller (nomCo, prenomCo, idCo, mdcCo) VALUES (?, ?, ?, ?)');
    stmt.run('Dupont', 'Jean', 'Dupont.Jean', hash);  // Insérer un conseiller avec mot de passe haché
}

// Fonction pour insérer un conseiller
function insertConseiller(numAE, nomCO, prenomCO, mdpCO) {
    const hash = argon2.hashSync(mdpCO); // Hacher le mot de passe
    const req = dbBCE.prepare('INSERT INTO Conseiller (numCo, nomCo, prenomCo, idCo, mdcCo) VALUES (?, ?, ?, ?, ?)');
    let idCO = nomCO + '.' + prenomCO;
    req.run(numAE, nomCO, prenomCO, idCO, hash); // Insertion avec mot de passe haché
}

// Exposer l'insertion du conseiller à l'IPC
ipcMain.handle('insertConseiller', (event, numAE, nomCO, prenomCO, mdpCO) => {
    insertConseiller(numAE, nomCO, prenomCO, mdpCO);
    return 'Conseiller ajouté avec succès';
});

// Fonction pour vérifier le mot de passe
async function verifyPassword(username, password) {
    
    const user = dbBCE.prepare('SELECT * FROM Conseiller WHERE idCo = ?').get(username);
    
    if (!user) {
        return false;
    }


    try {
        const valid = await argon2.verify(user.mdcCo, password);  // Vérification du mot de passe
        
        return valid;
    } catch (err) {
        console.log("Erreur lors de la vérification du mot de passe:", err);  // Log en cas d'erreur
        return false;
    }
}

// Gestion de la connexion
ipcMain.handle('login', async (event, username, password) => {
    const isValid = await verifyPassword(username, password);
    return isValid;
});

// Appeler cette méthode quand Electron a fini de s'initialiser
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
