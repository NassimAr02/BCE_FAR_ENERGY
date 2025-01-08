CREATE TABLE Conseiller(
   numCO INTEGER,
   identifiant VARCHAR(50),
   nom VARCHAR(30),
   prenom VARCHAR(30),
   mdpConseiller VARCHAR(50),
   PRIMARY KEY(numCO)
);

CREATE TABLE Client(
   SIRET VARCHAR(50),
   raisonSociale VARCHAR(50),
   numRue VARCHAR(12),
   rue VARCHAR(50),
   ville VARCHAR(50),
   CP VARCHAR(5),
   secteurActivite VARCHAR(50),
   effectifEntreprise INTEGER,
   horaireOuverture VARCHAR(50),
   dateCreation VARCHAR(50),
   consommationAnnuelle DECIMAL(20,2),
   proprieteMur LOGICAL,
   dureeAmortissement VARCHAR(15),
   dépenseElec DECIMAL(20,2),
   natureProjet VARCHAR(50),
   PRIMARY KEY(SIRET)
);

CREATE TABLE representantClient(
   SIRET VARCHAR(50),
   numR INTEGER,
   nomR VARCHAR(25),
   prenomR VARCHAR(25),
   telR VARCHAR(15),
   emailR VARCHAR(50),
   PRIMARY KEY(SIRET, numR),
   FOREIGN KEY(SIRET) REFERENCES Client(SIRET)
);

CREATE TABLE equipementClient(
   numEquipement INTEGER,
   puissanceCompteur DECIMAL(15,2),
   ampérage DECIMAL(15,2),
   pointLivraison VARCHAR(50),
   typeCourant VARCHAR(50),
   SIRET VARCHAR(50) NOT NULL,
   PRIMARY KEY(numEquipement),
   FOREIGN KEY(SIRET) REFERENCES Client(SIRET)
);

CREATE TABLE bilan(
   numBilan INTEGER,
   consoKwH DECIMAL(15,2),
   montantGlobal DECIMAL(15,2),
   abo_Conso VARCHAR(50),
   partAcheminement DECIMAL(15,2),
   CTA_CSPE DECIMAL(15,2),
   TVA DECIMAL(4,2),
   necessite LOGICAL,
   motivationProjet VARCHAR(500),
   refusProjet VARCHAR(500),
   numCO INTEGER NOT NULL,
   numEquipement INTEGER NOT NULL,
   PRIMARY KEY(numBilan),
   FOREIGN KEY(numCO) REFERENCES Conseiller(numCO),
   FOREIGN KEY(numEquipement) REFERENCES equipementClient(numEquipement)
);

CREATE TABLE simulationClient(
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
   numCO INTEGER NOT NULL,
   numBilan INTEGER NOT NULL,
   PRIMARY KEY(numSimulation),
   FOREIGN KEY(numCO) REFERENCES Conseiller(numCO),
   FOREIGN KEY(numBilan) REFERENCES bilan(numBilan)
);
