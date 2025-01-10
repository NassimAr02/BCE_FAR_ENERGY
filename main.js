
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
    try {
        const dbPath = path.join(app.getPath('userData'), "database.sqlite");
        dbBCE = new Database(dbPath);

        // Activer les contraintes de clé étrangère
        dbBCE.exec('PRAGMA foreign_keys = ON;');

        // dbBCE.exec(`
        //     DROP TABLE IF EXISTS Conseiller;
        //     DROP TABLE IF EXISTS Client;
        //     DROP TABLE IF EXISTS bilan;
        //     DROP TABLE IF EXISTS representantClient;
        //     DROP TABLE IF EXISTS simulationClient;
        // `);
        // Créer les tables (extrait de votre code)
        dbBCE.exec(`
            
            CREATE TABLE IF NOT EXISTS Conseiller(
                numCo INTEGER,
                idCo VARCHAR(50),
                nomCo VARCHAR(30),
                prenomCo VARCHAR(30),
                mdpCo VARCHAR(50),
                PRIMARY KEY(numCo)
            );
            
            CREATE TABLE IF NOT EXISTS Client(
                SIRET VARCHAR(50),
                raisonSociale VARCHAR(50),
                adresse VARCHAR(150),
                secteurActivite VARCHAR(50),
                effectifEntreprise INTEGER,
                horaireOuverture VARCHAR(50),
                dateCreation VARCHAR(50),
                consommationAnnuelle DECIMAL(20,2),
                proprieteMur BOOLEAN,
                dureeAmortissement VARCHAR(15),
                dépenseElec DECIMAL(20,2),
                natureProjet VARCHAR(50),
                puissanceCompteur DECIMAL(15,2),
                ampérage DECIMAL(15,2),
                pointLivraison VARCHAR(50),
                typeCourant VARCHAR(50),
                PRIMARY KEY(SIRET)
            );
            
            CREATE TABLE IF NOT EXISTS bilan(
                numBilan INTEGER,
                necessite BOOLEAN,
                consoKwH DECIMAL(15,2),
                montantGlobal DECIMAL(15,2),
                abo_Conso VARCHAR(50),
                partAcheminement DECIMAL(15,2),
                CTA_CSPE DECIMAL(15,2),
                TVA DECIMAL(4,2),
                motivationProjet VARCHAR(500),
                refusProjet VARCHAR(500),
                SIRET VARCHAR(50) NOT NULL,
                numCo INTEGER NOT NULL,
                PRIMARY KEY(numBilan),
                FOREIGN KEY(SIRET) REFERENCES Client(SIRET),
                FOREIGN KEY(numCo) REFERENCES Conseiller(numCo)
            );
    
            CREATE TABLE IF NOT EXISTS representantClient(
                SIRET VARCHAR(50),
                numR INTEGER,
                nomR VARCHAR(25),
                prenomR VARCHAR(25),
                telR VARCHAR(15),
                emailR VARCHAR(50),
                PRIMARY KEY(SIRET, numR),
                FOREIGN KEY(SIRET) REFERENCES Client(SIRET)
            );
            
            CREATE TABLE IF NOT EXISTS simulationClient(
                numSimulation INTEGER,
                prixKwH2024 DECIMAL(15,2),
                prixKwH2030 DECIMAL(15,2),
                prixKwH2035 DECIMAL(15,2),
                montant10A DECIMAL(15,2),
                acheminement10A DECIMAL(15,2),
                capacitéProd DECIMAL(15,2),
                puissanceInsta DECIMAL(15,2),
                coutPanneau DECIMAL(15,2),
                coutBatterie DECIMAL(15,2),
                primeAutoCo DECIMAL(15,2),
                RAC VARCHAR(50),
                dateBilan VARCHAR(50),
                economie25a VARCHAR(50),
                graphiqueF VARCHAR(150),
                numCo INTEGER NOT NULL,
                numBilan INTEGER NOT NULL,
                PRIMARY KEY(numSimulation),
                FOREIGN KEY(numCo) REFERENCES Conseiller(numCo),
                FOREIGN KEY(numBilan) REFERENCES bilan(numBilan)
            );
        `);

        // Exemple d'ajout d'un conseiller
        const password = 'monMotDePasse';
        const hash = await argon2.hash(password);
        const stmt = dbBCE.prepare('INSERT OR IGNORE INTO Conseiller (nomCo, prenomCo, idCo, mdpCo) VALUES (?, ?, ?, ?)');
        stmt.run('Dupont', 'Jean', 'Dupont.Jean', hash);
    } catch (err) {
        console.error('Erreur lors de l\'initialisation de la base de données :', err);
    }
}




// Fonction pour insérer un conseiller
async function insertConseiller(nomCO, prenomCO, mdpCO) {
    const hash = await argon2.hash(mdpCO); // Hacher le mot de passe
    const req = dbBCE.prepare('INSERT INTO Conseiller (nomCo, prenomCo, idCo, mdpCo) VALUES (?, ?, ?, ?)');
    const idCO = `${nomCO}.${prenomCO}`; // Génération de l'identifiant
    req.run(nomCO, prenomCO, idCO, hash); // Insertion avec mot de passe haché
}



// Exposer l'insertion du conseiller à l'IPC
ipcMain.handle('insertConseiller', async (event, nomCO, prenomCO, mdpCO) => {
    try {
        await insertConseiller(nomCO, prenomCO, mdpCO); // Appel de la fonction asynchrone
        return 'Conseiller ajouté avec succès';
    } catch (err) {
        console.error("Erreur lors de l'insertion du conseiller : ", err);
        throw new Error('Échec de l\'ajout du conseiller');
    }
});

async function insertClient(SIRET,raisonSociale,adresse,secteurActivite,effectifEntreprise,horaireOuverture,dateCreation,consommationAnnuelle,proprieteMur,dureeAmortissement,dépenseElec,natureProjet,puissanceCompteur,ampérage,pointLivraison,typeCourant){
    const req = dbBCE.prepare('INSERT INTO CLIENT(SIRET,raisonSociale,adresse,secteurActivite,effectifEntreprise,horaireOuverture,dateCreation,consommationAnnuelle,proprieteMur,dureeAmortissement,dépenseElec,natureProjet,puissanceCompteur,ampérage,pointLivraison,typeCourant) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
    req.run(SIRET,raisonSociale,adresse,secteurActivite,effectifEntreprise,horaireOuverture,dateCreation,consommationAnnuelle,proprieteMur,dureeAmortissement,dépenseElec,natureProjet,puissanceCompteur,ampérage,pointLivraison,typeCourant);
}
ipcMain.handle('insertClient',async (event,SIRET,raisonSociale,adresse,secteurActivite,effectifEntreprise,horaireOuverture,dateCreation,consommationAnnuelle,proprieteMur,dureeAmortissement,dépenseElec,natureProjet,puissanceCompteur,ampérage,pointLivraison,typeCourant) =>{
    try {
        await insertClient(SIRET,raisonSociale,adresse,secteurActivite,effectifEntreprise,horaireOuverture,dateCreation,consommationAnnuelle,proprieteMur,dureeAmortissement,dépenseElec,natureProjet,puissanceCompteur,ampérage,pointLivraison,typeCourant)
        numSIRET = SIRET;
        return 'Client ajouté avec succès';
    } catch (err){
        console.error("Erreur lors de l'insertion du client : ",err);
        throw new Error("Échec de l\'ajout du client");
    }
})
async function insertRepresentantClient(SIRET,nomR,prenomR,telR,emailR){
    const req = dbBCE.prepare('INSERT INTO representantClient(SIRET,nomR,prenomR,telR,emailR) VALUES(?,?,?,?,?)');
    req.run(SIRET,nomR,prenomR,telR,emailR);
}
ipcMain.handle('insertRepresentantClient',async(event,SIRET,nomR,prenomR,telR,emailR) => {
    try {
        await insertRepresentantClient(SIRET,nomR,prenomR,telR,emailR);
        return 'Représentant ajouté avec succès';
    } catch(err){
        console.error("Erreur lors de l'insertion du représentant : ",err)
        throw new Error("Échec de l\'ajout du représentant client");
    }
})
let numCon;
let numSIRET; 
// Fonction pour vérifier le mot de passe
async function verifyPassword(username, password) {
    
    const user = dbBCE.prepare('SELECT * FROM Conseiller WHERE idCo = ?').get(username);
    
    if (!user) {
        return false;
    }

    try {
        const valid = await argon2.verify(user.mdpCo, password);  // Vérification du mot de passe
        numCon = user.numCo;
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
async function insertBilan(necessite,consoKwH,montantGlobal,abo_conso,partAcheminement,CTA_CSPE,TVA,motivationProjet,refusProjet,SIRET){
    const req = dbBCE.prepare('INSERT INTO bilan(necessite,consoKwH,montantGlobal,abo_conso,partAcheminement,CTA_CSPE,TVA,motivationProjet,refusProjet,SIRET,numCo) VALUES(?,?,?,?,?,?,?,?,?,?)')
    req.run(necessite,consoKwH,montantGlobal,abo_conso,partAcheminement,CTA_CSPE,TVA,motivationProjet,refusProjet,SIRET,numCon)
}

ipcMain.handle('insertBilan',async(event,necessite,consoKwH,montantGlobal,abo_conso,partAcheminement,CTA_CSPE,TVA,motivationProjet,refusProjet,SIRET)=>{
    try {
        await insertBilan(necessite,consoKwH,montantGlobal,abo_conso,partAcheminement,CTA_CSPE,TVA,motivationProjet,refusProjet,SIRET)
        return 'Bilan ajouté avec succès';
    } catch(err){
        console.error('Erreur lors de l\'insertion du bilan : ',err)
        throw new Error('Erreur lors de l\'ajout du bilan') 
    }
})
async function insertSimulationClient(){

}
function clearDatabase() {
    try {
        dbBCE.exec('PRAGMA foreign_keys = OFF;'); // Désactiver les clés étrangères pour éviter les conflits

        // Vider chaque table
        dbBCE.exec('DELETE FROM Conseiller;');
        dbBCE.exec('DELETE FROM Client;');
        dbBCE.exec('DELETE FROM bilan;');
        dbBCE.exec('DELETE FROM representantClient;');
        dbBCE.exec('DELETE FROM simulationClient;');

        console.log("Toutes les données de la base de données ont été effacées.");
    } catch (err) {
        console.error("Erreur lors de l'effacement des données :", err);
    } finally {
        dbBCE.exec('PRAGMA foreign_keys = ON;'); // Réactiver les clés étrangères
    }
}



// Appeler cette méthode quand Electron a fini de s'initialiser
app.whenReady().then(() => {
  createWindow()
  clearDatabase();  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
