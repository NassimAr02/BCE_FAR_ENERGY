 CREATE TABLE IF NOT EXISTS Conseiller(
                numCo INTEGER  NOT NULL,
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
                numBilan INTEGER NOT NULL,
                necessite BOOLEAN,
                consoKwH DECIMAL(15,2),
                montantGlobal DECIMAL(15,2),
                abo_Conso VARCHAR(50),
                partAcheminement DECIMAL(15,2),
                CTA_CSPE DECIMAL(15,2),
                TVA DECIMAL(4,2),
                montantGlobalTA DECIMAL(15,2),
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
                nomR VARCHAR(25),
                prenomR VARCHAR(25),
                telR VARCHAR(15),
                emailR VARCHAR(50),
                PRIMARY KEY(SIRET),
                FOREIGN KEY(SIRET) REFERENCES Client(SIRET)
            );
            
            CREATE TABLE IF NOT EXISTS simulationClient(
                numSimulation INTEGER NOT NULL,
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
                dateBilan DATE DEFAULT CURRENT_TIMESTAMP,
                economie25a VARCHAR(50),
                graphiqueF VARCHAR(150),
                numCo INTEGER NOT NULL,
                numBilan INTEGER NOT NULL,
                PRIMARY KEY(numSimulation),
                FOREIGN KEY(numCo) REFERENCES Conseiller(numCo),
                FOREIGN KEY(numBilan) REFERENCES bilan(numBilan)
            );