
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('ATDD Backend - Gestion des demandes agricoles (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // SCÉNARIO 1: Création de demande agriculteur
  describe('SCÉNARIO AGRICULTEUR', () => {
    test('POST /api/demandes - Échec création avec champs obligatoires vides', async () => {
      // Given - Données vides
      const demandeVide = {};
      
      // When - Tentative de création
      const response = await request(app.getHttpServer())
        .post('/api/demandes')
        .send(demandeVide);
      
      // Then - Doit retourner erreur 400
      expect(response.status).toBe(400);
    });

    test('POST /api/demandes - Création demande valide avec succès', async () => {
      // Given - Demande valide
      const demandeValide = {
        nom: 'Marie Martin',
        email: 'marie.martin@ferme.fr',
        nombreVaches: 25,
        description: 'Ferme laitière biologique'
      };
      
      // When - Création de la demande
      const response = await request(app.getHttpServer())
        .post('/api/demandes')
        .send(demandeValide);
      
      // Then - Succès
      expect(response.status).toBe(201);
      expect(response.body.demandeId).toBeDefined();
    });
  });

  // SCÉNARIO 2: Traitement admin
  describe('SCÉNARIO ADMIN', () => {
    test('GET /api/admin/demandes - Filtrage demandes >20 vaches', async () => {
      // When - Récupération avec filtre
      const response = await request(app.getHttpServer())
        .get('/api/admin/demandes')
        .query({ minVaches: 20 });
      
      // Then - Seules les demandes >20 vaches
      expect(response.status).toBe(200);
      
      // Vérification que toutes les demandes retournées ont >20 vaches
      if (response.body.length > 0) {
        response.body.forEach((demande: any) => {
          expect(demande.nombreVaches).toBeGreaterThan(20);
        });
      }
    });
  });

  // SCÉNARIO 3: Workflow complet simulé
  describe('SCÉNARIO COMPLET', () => {
    test('Workflow complet création → validation → évaluation', async () => {
      // 1. Création demande
      const creationResponse = await request(app.getHttpServer())
        .post('/api/demandes')
        .send({
          nom: 'Test Ferme',
          email: 'test@ferme.fr',
          nombreVaches: 30,
          description: 'Test description'
        });
      
      expect(creationResponse.status).toBe(201);
      
      // 2. Simulation approbation admin
      const demandeId = creationResponse.body.demandeId;
      const approbationResponse = await request(app.getHttpServer())
        .patch(`/api/admin/demandes/${demandeId}`)
        .send({ statut: 'APPROUVEE' });
      
      expect([200, 201]).toContain(approbationResponse.status);
      
      // 3. Simulation évaluation jury
      const evaluationResponse = await request(app.getHttpServer())
        .post('/api/evaluations')
        .send({
          demandeId: demandeId,
          notes: 'Évaluation favorable',
          score: 85,
          eligible: true
        });
      
      expect([200, 201]).toContain(evaluationResponse.status);
    });
  });
});