// main.js
// Modules pour la gestion de l'appli et la création de la BrowserWindow native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const Database = require('better-sqlite3');
const argon2 = require('argon2');
const createWindow = () => {
  // Création de la browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false, 
        preload: path.join(__dirname, 'preload.js')
    }
  })

  // et chargement de l'index.html de l'application.
  mainWindow.loadFile('index.html')

  // Ouvrir les outils de développement.
  // mainWindow.webContents.openDevTools()
  initDatabase();
}
function initDatabase() {
    const dbPath = path.join(app.getPath('userData'), "database.sqlite")
    const dbBCE =new Database(dbPath);
    dbBCE.exec(`
        CREATE TABLE IF NOT EXISTS Conseiller(
            numAE VARCHAR PRIMARY KEY,
            nomCo TEXT NOT NULL,
            prenomCo TEXT NOT NULL,
            mdcCo VARCHAR NOT NULL
        )
        `)
    //     const password = 'monMotDePasse'; // Le mot de passe à hacher
    // const hash = await argon2.hash(password);

    // // Insertion dans la base de données avec mot de passe haché
    // const stmt = dbBCE.prepare('INSERT INTO Conseiller (numAE, nomCo, prenomCo, mdcCo) VALUES (?, ?, ?, ?)');
    // stmt.run('12345', 'Dupont', 'Jean', hash);  // Insérer un conseiller avec mot de passe haché
}
function insertConseiller(numAE,nomCO,prenomCO,mdpCO){
    const req =db.prepare('INSERT INTO Conseiller(numAE,nomCo,prenomCo,mdpCo)VALUE(?,?,?,?)')
    req.run(numAE,nomCO,prenomCO,mdpCO);
}
async function verifyPassword(username, password) {
    const user = db.prepare('SELECT * FROM Users WHERE username = ?').get(username);
    if(!user) {
        return false;
    }
    try{
        const valid =await argon2.verify(user, password);
        return valid;

    } catch (err){
        console.log('Erreur lors de la vérification du mot de passe: ',err);
        return false;
    }
}
ipcMain.handle('login',async (event,username,password) => {
    const isValid =await verifyPassword(username, password);
    return isValid;
})
// Cette méthode sera appelée quand Electron aura fini
// de s'initialiser et sera prêt à créer des fenêtres de navigation.
// Certaines APIs peuvent être utilisées uniquement quant cet événement est émit.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // Sur macOS il est commun de re-créer une fenêtre  lors 
    // du click sur l'icone du dock et qu'il n'y a pas d'autre fenêtre ouverte.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quitter quand toutes les fenêtres sont fermées, sauf sur macOS. Dans ce cas il est courant
// que les applications et barre de menu restents actives jusqu'à ce que l'utilisateur quitte 
// de manière explicite par Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// Dans ce fichier vous pouvez inclure le reste du code spécifique au processus principal. Vous pouvez également le mettre dans des fichiers séparés et les inclure ici.