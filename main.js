// Modules pour la gestion de l'appli et la création de la BrowserWindow native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const Database = require('better-sqlite3');
const argon2 = require('argon2');
const { shell } = require('electron');
const Chart = require('chart.js');
// Déclarez dbBCE en dehors de initDatabase pour qu'elle soit accessible globalement
let dbBCE;

const createWindow = () => {
  // Création de la browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: true, 
        preload: path.join(__dirname, 'preload.js')
    }
  })
  // Cette fonction récupère toutes les données de la base de données
    function afficherToutesLesDonnees() {
        try {
            const tables = dbBCE.prepare("SELECT name FROM sqlite_master WHERE type='table';").all();
            
            tables.forEach(table => {
                console.log(`\nDonnées de la table : ${table.name}`);
                const rows = dbBCE.prepare(`SELECT * FROM ${table.name}`).all();
                console.log(rows);
                // Envoie les données à la fenêtre de rendu
                mainWindow.webContents.send('send-data', { tableName: table.name, rows: JSON.parse(JSON.stringify(rows)) });
            });
        } catch (err) {
            console.error("Erreur lors de l'affichage des données : ", err);
        }
    }

    // Afficher les données toutes les 30 secondes
    setInterval(afficherToutesLesDonnees, 30000);


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
        dbBCE.pragma('journal_mode = WAL');
        
        

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
                numCO INTEGER PRIMARY KEY AUTOINCREMENT,
                idCo VARCHAR(50),
                nomCo VARCHAR(30),
                prenomCo VARCHAR(30),
                mdpCo VARCHAR(64)
            );

            CREATE TABLE IF NOT EXISTS Client(
                SIRET VARCHAR(50) PRIMARY KEY,
                raisonSociale VARCHAR(50),
                numRue VARCHAR(12),
                rue VARCHAR(50),
                ville VARCHAR(50),
                CP VARCHAR(5),
                secteurActivite VARCHAR(50),
                effectifEntreprise INT,
                horaireOuverture VARCHAR(50),
                dateCreation VARCHAR(50),
                consommationAnnuelle DECIMAL(20,2),
                proprieteMur BOOLEAN,
                dureeAmortissement VARCHAR(15),
                depenseElec DECIMAL(20,2),
                natureProjet VARCHAR(50),
                puissanceCompteur DECIMAL(15,2),
                amperage DECIMAL(15,2),
                pointLivraison VARCHAR(50),
                typeCourant VARCHAR(50)
            );

            CREATE TABLE IF NOT EXISTS representantClient(
                SIRET VARCHAR(50),
                nomR VARCHAR(25),
                prenomR VARCHAR(25),
                telR VARCHAR(15),
                emailR VARCHAR(50),
                PRIMARY KEY(SIRET),
                FOREIGN KEY(SIRET) REFERENCES Client(SIRET)
            );

            CREATE TABLE IF NOT EXISTS bilanSimulation(
                numBilanSimulation INTEGER PRIMARY KEY AUTOINCREMENT,
                consoKwH DECIMAL(15,2),
                montantGlobal DECIMAL(15,2),
                abo_Conso VARCHAR(50),
                partAcheminement DECIMAL(15,2),
                CTA_CSPE DECIMAL(15,2),
                TVA DECIMAL(4,2),
                necessite BOOLEAN,
                motivationProjet VARCHAR(500),
                refusProjet VARCHAR(500),
                prixKwH2024 DECIMAL(15,2),
                prixKwH2030 DECIMAL(15,2),
                prixKwH2035 DECIMAL(15,2),
                montantGlobalTA DECIMAL(15,2),
                capaciteProd DECIMAL(15,2),
                puissanceInsta DECIMAL(15,2),
                coutPanneau DECIMAL(15,2),
                coutBatterie DECIMAL(15,2),
                primeAutoCo DECIMAL(15,2),
                RAC VARCHAR(50),
                dateBilan DATETIME DEFAULT CURRENT_TIMESTAMP,
                economie25a VARCHAR(50),
                SIRET VARCHAR(50) NOT NULL,
                numCO INT NOT NULL,
                FOREIGN KEY(SIRET) REFERENCES Client(SIRET),
                FOREIGN KEY(numCO) REFERENCES Conseiller(numCO)
            );


            CREATE VIEW IF NOT EXISTS vueBilan 
            AS
            SELECT 
                b.numBilan,
                C.SIRET,
                C.raisonSociale,
                b.necessite,
                S.dateBilan,
                b.montantGlobal
                
            FROM Client C,bilan b, simulationClient S WHERE C.SIRET = b.SIRET AND S.numBilan = b.numBilan
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


async function selectVueBilan(){
    const req = dbBCE.prepare('SELECT * FROM vueBilan');
    console.log('Données récupérées de vueBilan :', result); // Debug : Affichez les données récupérées
    const result =  req.all();
    return result 
}
ipcMain.handle('selectVueBilan',async (event) => {
    try{
        const bilan = await selectVueBilan();
        return bilan;

    } catch(err){
        console.error('Erreur lors de la récupération des données de vueBilan :', err);
        throw new Error('Erreur lors de la récupération des données de la vueBilan');
    }
})


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



async function insertBilanSimulation(consoKwH,montantGlobal,abo_conso,partAcheminement,CTA_CSPE,TVA,necessite,
    motivationProjet,refusProjet,prixKwH2024,prixKwH2030,prixKwH2035,montantGlobalTA,capaciteProd,
    puissanceInsta,coutPanneau,coutBatterie,primeAutoCo,RAC,economie25a,SIRET){
    const req = dbBCE.prepare('INSERT INTO bilanSimulation(consoKwH,montantGlobal,abo_conso,partAcheminement,CTA_CSPE,TVA,necessite,motivationProjet,refusProjet,prixKwH2024,prixKwH2030,prixKwH2035,montantGlobalTA,capaciteProd,puissanceInsta,coutPanneau,coutBatterie,primeAutoCo,RAC,economie25a,SIRET,numCo) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)')
    req.run(consoKwH,montantGlobal,abo_conso,partAcheminement,CTA_CSPE,TVA,necessite,
        motivationProjet,refusProjet,prixKwH2024,prixKwH2030,prixKwH2035,montantGlobalTA,capaciteProd,
        puissanceInsta,coutPanneau,coutBatterie,primeAutoCo,RAC,economie25a,SIRET,numCon)
}

ipcMain.handle('insertBilanSimulation',async(event,consoKwH,montantGlobal,abo_conso,partAcheminement,CTA_CSPE,TVA,necessite,
    motivationProjet,refusProjet,prixKwH2024,prixKwH2030,prixKwH2035,montantGlobalTA,capaciteProd,
    puissanceInsta,coutPanneau,coutBatterie,primeAutoCo,RAC,economie25a,SIRET)=>{
    try {
        await insertBilanSimulation(consoKwH,montantGlobal,abo_conso,partAcheminement,CTA_CSPE,TVA,necessite,
            motivationProjet,refusProjet,prixKwH2024,prixKwH2030,prixKwH2035,montantGlobalTA,capaciteProd,
            puissanceInsta,coutPanneau,coutBatterie,primeAutoCo,RAC,economie25a,SIRET)
        return 'BilanSimulation ajouté avec succès';
    } catch(err){
        console.error('Erreur lors de l\'insertion du BilanSimulation : ',err)
        throw new Error('Erreur lors de l\'ajout du BilanSimulation') 
    }
})

function clearDatabase() {
    try {
        dbBCE.exec('PRAGMA foreign_keys = OFF;'); // Désactiver les clés étrangères pour éviter les conflits

        // Vider chaque table
        dbBCE.exec('DELETE FROM Conseiller;');
        dbBCE.exec('DELETE FROM Client;');
        dbBCE.exec('DELETE FROM representantClient;');
        dbBCE.exec('DELETE FROM bilanSimulation');

        console.log("Toutes les données de la base de données ont été effacées.");
    } catch (err) {
        console.error("Erreur lors de l'effacement des données :", err);
    } finally {
        dbBCE.exec('PRAGMA foreign_keys = ON;'); // Réactiver les clés étrangères
    }
}

ipcMain.on('open-link', (event, url) => {
    console.log('URL reçue pour ouvrir un lien externe :', url);
    shell.openExternal(url).catch((err) => {
        console.error('Erreur lors de l\'ouverture du lien externe :', err);
    });
});

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
