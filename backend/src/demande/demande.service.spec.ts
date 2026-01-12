// src/demandes/demandes.integration.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DemandesService } from './demande.service';
import { DemandesController } from './demande.controller';
import { Demande } from './entities/demande.entity';
import { CreateDemandeDto } from './dto/create-demande.dto';
import { UpdateDemandeDto } from './dto/update-demande.dto';

describe('Demandes Integration', () => {
  let service: DemandesService;
  let controller: DemandesController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [Demande],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Demande]),
      ],
      controllers: [DemandesController],
      providers: [DemandesService],
    }).compile();

    service = module.get<DemandesService>(DemandesService);
    controller = module.get<DemandesController>(DemandesController);
  });

  it('should create a demande', async () => {
    const dto: CreateDemandeDto = {
      nom: 'Abir',
      prenom: 'Mansour',
      telephone: '12345678',
      email: 'abir@test.com',
      adresse: 'Tunis',
      region: 'Nord',
      superficieFerme: 10,
      nombreVaches: 5,
      role: 'agriculteur',
    };

    const created = await controller.create(dto);
    expect(created).toBeDefined();
    expect(created.uid).toBeDefined();
    expect(created.nom).toBe(dto.nom);
  });

  it('should find a demande by id', async () => {
    const dto: CreateDemandeDto = {
      nom: 'Ali',
      prenom: 'Ben',
      telephone: '87654321',
      email: 'ali@test.com',
      adresse: 'Sousse',
      region: 'Centre',
      superficieFerme: 15,
      nombreVaches: 8,
      role: 'agriculteur',
    };

    const created = await controller.create(dto);
    const found = await controller.findOneById(created.uid);

    expect(found).not.toBeNull();
    if (found) {
      expect(found.uid).toBe(created.uid);
      expect(found.email).toBe(dto.email);
    }
  });

  it('should update a demande', async () => {
    const dto: CreateDemandeDto = {
      nom: 'Sara',
      prenom: 'Hassan',
      telephone: '11122233',
      email: 'sara@test.com',
      adresse: 'Sfax',
      region: 'Sud',
      superficieFerme: 20,
      nombreVaches: 10,
      role: 'agriculteur',
    };

    const created = await controller.create(dto);

    const updateDto: UpdateDemandeDto = {
      eligible: true,
      role: 'agriculteur confirmé',
    };

    const updated = await controller.update(created.uid, updateDto, { user: { userId: 'admin123' } });

    expect(updated.eligible).toBe(true);
    expect(updated.statut).toBe('Validé');
    expect(updated.validatedBy).toBe('admin123');
  });

  it('should find a demande by email', async () => {
    const dto: CreateDemandeDto = {
      nom: 'Youssef',
      prenom: 'Ahmed',
      telephone: '44455566',
      email: 'youssef@test.com',
      adresse: 'Bizerte',
      region: 'Nord',
      superficieFerme: 12,
      nombreVaches: 6,
      role: 'agriculteur',
    };

    await controller.create(dto);
    const found = await controller.findByEmail(dto.email);

    expect(found).not.toBeNull();
    if (found) {
      expect(found.email).toBe(dto.email);
    }
  });
});
