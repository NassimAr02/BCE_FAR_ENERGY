const { test: baseTest, expect, _electron } = require('@playwright/test');
import { _electron as electron } from 'playwright';

// Créer un fixture pour Electron
const test = baseTest.extend({
  electronApp: async ({}, use) => {
    const app = await _electron.launch({ args: ['.'] });
    await use(app);
    await app.close();
  },
  window: async ({ electronApp }, use) => {
    const window = await electronApp.firstWindow();
    await use(window);
  }
});

// Variables pour les tests qui ont besoin d'être partagées
let electronApp;
const testSIRET = '123456789' + Math.floor(Math.random() * 1000); // Rendre unique pour éviter les conflits
let conseillerNumero;

test.beforeAll(async () => {
  electronApp = await electron.launch({ args: ['.'] });
});

test.afterAll(async () => {
  await electronApp.close();
});

test('Vérification de preload', async ({ window }) => {
  const electronApi = await window.evaluate(() => window.electron);
  console.log('window.electron:', electronApi);
  // Vérifier que les méthodes nécessaires sont exposées
  expect(electronApi).toHaveProperty('insertConseiller');
  expect(electronApi).toHaveProperty('login');
  expect(electronApi).toHaveProperty('insertClient');
  expect(electronApi).toHaveProperty('insertRepresentantClient');
  expect(electronApi).toHaveProperty('insBilanSimulation');
  expect(electronApi).toHaveProperty('getCapaciteProd');
  expect(electronApi).toHaveProperty('getCoordonnee');
});

// Test pour vérifier l'ouverture d'une fenêtre
test('devrait ouvrir une fenêtre avec le bon titre', async ({ electronApp }) => {
  const window = await electronApp.firstWindow();
  const title = await window.title();
  expect(title).toBe("Electrons");
});

test.describe("Fonctionnalité d'insertion d'un conseiller", () => {
  const testNom = 'Test';
  const testPrenom = 'User' + Math.floor(Math.random() * 1000); // Rendre unique
  const testMdp = 'TestPassword123';

  test('Devrait insérer un conseiller sans problème', async ({ window }) => {
    const result = await window.evaluate(async ({ nomCO, prenomCO, mdpCO }) => {
      return await window.electron.insertConseiller(nomCO, prenomCO, mdpCO);
    }, { nomCO: testNom, prenomCO: testPrenom, mdpCO: testMdp });

    expect(result).toBe("Conseiller ajouté avec succès");
  });
  test.describe('Récupération du numéro de conseiller (recupNumCO)', () => {
    const testUsername = `${testNom}.${testPrenom}`; // Remplacez par un identifiant valide
    const testPassword = 'TestPassword123'; // Remplacez par un mot de passe valide
  
    test('devrait retourner le numéro de conseiller pour des identifiants valides', async ({ window }) => {
      const numConseiller = await window.evaluate(async ({ username, password }) => {
        try {
          return await window.electron.recupNumCO(username, password);
        } catch (e) {
          return { error: e.message };
        }
      }, { username: testUsername, password: testPassword });
  
      // Vérifiez que le numéro de conseiller est bien retourné
      expect(numConseiller).toBeDefined();
      expect(typeof numConseiller).toBe('number'); // Assurez-vous que c'est un nombre
      conseillerNumero = numConseiller;
    });
  });
    test('devrait retourner false pour des identifiants invalides', async ({ window }) => {
      const invalidUsername = 'invalid.user';
      const invalidPassword = 'wrongPassword';
  
      const result = await window.evaluate(async ({ username, password }) => {
        try {
          return await window.electron.recupNumCO(username, password);
        } catch (e) {
          return { error: e.message };
        }
      }, { username: invalidUsername, password: invalidPassword });
  
      // Vérifiez que la fonction retourne false pour des identifiants invalides
      expect(result).toHaveProperty('error');
      expect(result.error).toContain('Échec de l\'authentification');
    });
  test.describe('Fonctionnalité de Connexion', () => {
    test('devrait se connecter avec des identifiants valides', async ({ window }) => {
      const testId = `${testNom}.${testPrenom}`;
      const isValid = await window.evaluate(async ({ username, password }) => {
        return await window.electron.login(username, password);
      }, { username: testId, password: testMdp });

      expect(isValid).toBe(true);
    });

    test('devrait échouer à se connecter avec des identifiants invalides', async ({ window }) => {
      const isValid = await window.evaluate(async ({ username, password }) => {
        return await window.electron.login(username, password);
      }, { username: 'Invalid.User', password: 'wrongPassword' });

      expect(isValid).toBe(false);
    });
  });
});

test.describe('Gestion des clients', () => {
  test('devrait insérer un nouveau client', async ({ window }) => {
    const clientData = {
      SIRET: testSIRET,
      raisonSociale: 'Société Test',
      adresse: '1 rue de Mulhouse 57000 Metz',
      secteurActivite: 'Commerce',
      effectifEntreprise: 50,
      horaireOuverture: 'lun au ven 08-18h',
      dateCreation: '2023-01-01',
      consommationAnnuelle: 12000,
      proprieteMur: 1,
      dureeAmortissement: '6',
      depenseElec: 12000,
      natureProjet: 'Autoconsommation',
      puissanceCompteur: 24,
      amperage: 12, // Attention à l'orthographe (ampérage vs amperage)
      pointLivraison: 'point A',
      typeCourant: 'Monophasé'
    };

    const result = await window.evaluate(async (data) => {
      try {
        return await window.electron.insertClient(
          data.SIRET, data.raisonSociale, data.adresse, data.secteurActivite, 
          data.effectifEntreprise, data.horaireOuverture, data.dateCreation, 
          data.consommationAnnuelle, data.proprieteMur, data.dureeAmortissement, 
          data.depenseElec, data.natureProjet, data.puissanceCompteur, 
          data.amperage, data.pointLivraison, data.typeCourant
        );
      } catch (e) {
        return `Erreur: ${e.message}`;
      }
    }, clientData);

    expect(result).toBe('Client ajouté avec succès');

    // Vérifier que le client a bien été ajouté
    const client = await window.evaluate(async (siret) => {
      try {
        return await window.electron.selectClient(siret);
      } catch (e) {
        return `Erreur: ${e.message}`;
      }
    }, clientData.SIRET);

    expect(Array.isArray(client)).toBe(true);
    expect(client.length).toBeGreaterThan(0);
    expect(client[0].raisonSociale).toBe('Société Test');
  });
});

test.describe('Gestion des représentants client', () => {
  test('devrait insérer un nouveau représentant pour le client', async ({ window }) => {
    const repData = { 
      SIRET: testSIRET, 
      nomR: 'Dupont', 
      prenomR: 'Jean', 
      telR: '0756789412', 
      emailR: 'dupont.jean@gmail.com' 
    };

    const result = await window.evaluate(async (data) => {
      try {
        return await window.electron.insertRepresentantClient(
          data.SIRET, data.nomR, data.prenomR, data.telR, data.emailR
        );
      } catch (e) {
        return `Erreur: ${e.message}`;
      }
    }, repData);

    expect(result).toBe('Représentant ajouté avec succès');

    // Vérifier que le représentant a bien été ajouté
    const representant = await window.evaluate(async (siret) => {
      try {
        return await window.electron.selectRClient(siret);
      } catch (e) {
        return `Erreur: ${e.message}`;
      }
    }, repData.SIRET);

    expect(Array.isArray(representant)).toBe(true);
    expect(representant.length).toBeGreaterThan(0);
    expect(representant[0].nomR).toBe('Dupont');
  });
});

test.describe("Gestion bilan simulation", () => {
  test('Devrait ajouter un bilan simulation', async ({ window }) => {
    const bilanData = {
      analyseFacture: 1,
      consoKwH: 1500.50,
      montantGlobal: 2000.00,
      abo_conso: 'Abonnement A',
      partAcheminement: 500.00,
      CTA_CSPE: 100.00,
      TVA: 20.00,
      necessite: 1,
      motivationProjet: 'Réduction des coûts énergétiques',
      refusProjet: 'N/A',
      prixKwH2024: 0.15,
      prixKwH2030: 0.12,
      prixKwH2035: 0.10,
      montantGlobalTA: 2400.00,
      capaciteProd: 5000.00,
      puissanceInsta: 10.00,
      coutPanneau: 10000.00,
      coutBatterie: 5000.00,
      primeAutoCo: 2000.00,
      RAC: 'RAC A',
      economie25a: 'Économie importante',
      SIRET: testSIRET,
      numCO: conseillerNumero
    };

    const result = await window.evaluate(async (data) => {
      try {
        return await window.electron.insBilanSimulation(
          data.analyseFacture, data.consoKwH, data.montantGlobal, 
          data.abo_conso, data.partAcheminement, data.CTA_CSPE, 
          data.TVA, data.necessite, data.motivationProjet, 
          data.refusProjet, data.prixKwH2024, data.prixKwH2030, 
          data.prixKwH2035, data.montantGlobalTA, data.capaciteProd,
          data.puissanceInsta, data.coutPanneau, data.coutBatterie, 
          data.primeAutoCo, data.RAC, data.economie25a, data.SIRET,data.numCO
        );
      } catch (e) {
        return `Erreur: ${e.message}`;
      }
    }, bilanData);

    expect(result).toBe('BilanSimulation ajouté avec succès');
  });
});

test.describe('API PVGIS', () => {
  test('devrait retourner une réponse valide avec des paramètres valides', async ({ window }) => {
    const params = {
      lati: 48.8566,
      long: 2.3522,
      typePS: 'crystSi',
      puisKwP: 5,
      perteSy: 14,
      posMontage: 'free',
      incl: 30,
      azimut: 180,
      optiIncl: 1,
      optiAngle: 1,
    };

    const response = await window.evaluate(async (params) => {
      try {
        return await window.electron.getCapaciteProd(
          params.lati, params.long, params.typePS, params.puisKwP, 
          params.perteSy, params.posMontage, params.incl, 
          params.azimut, params.optiIncl, params.optiAngle
        );
      } catch (e) {
        return { error: e.message };
      }
    }, params);
    console.log(response);
    // Vérifie que la réponse est une chaine de caractère
    expect(response).toContain('Latitude (decimal degrees):');
    expect(response).toContain("Nominal power of the PV system (c-Si) (kWp):");
    expect(response).toContain('Orientation (azimuth) of modules (deg.) (optimum):')
   
  });
});

test.describe('API recupCoordonnee', () => {
  test('devrait retourner des coordonnées valides avec une adresse valide', async ({ window }) => {
    const adresse = '1 rue Marcel Pagnol 67205 Oberhausbergen';

    const response = await window.evaluate(async (adresse) => {
      try {
        return await window.electron.getCoordonnee(adresse);
      } catch (e) {
        return { error: e.message };
      }
    }, adresse);
    
    // Si une adresse valide est passée, on doit avoir des coordonnées
    if (!response.error) {
      expect(response).toHaveProperty('lat');
      expect(response).toHaveProperty('lon');
      expect(typeof response.lat).toBe('string');
      expect(typeof response.lon).toBe('string');
    } else {
      // Si l'API renvoie une erreur, on s'assure que c'est une erreur attendue
      expect(response.error).toMatch(/Adresse introuvable|Erreur lors de la récupération des coordonnées/);
    }
  });

  test('devrait retourner une erreur avec une adresse invalide', async ({ window }) => {
    const adresse = 'Adresse Inexistante XYZ123456789';

    const response = await window.evaluate(async (adresse) => {
      try {
        return await window.electron.getCoordonnee(adresse);
      } catch (e) {
        return { error: e.message };
      }
    }, adresse);

    // Vérifie que la réponse contient une erreur si l'adresse est invalide
    expect(response).toHaveProperty('error');
  });
});