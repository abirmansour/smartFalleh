// src/cooperative/cooperative.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { CooperativeService } from './cooperative.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cooperative } from './entities/cooperative.entity';
import { Repository } from 'typeorm';

describe('CooperativeService', () => {
  let service: CooperativeService;
  let repo: Repository<Cooperative>;

  const mockRepo = {
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CooperativeService,
        {
          provide: getRepositoryToken(Cooperative),
          useValue: mockRepo, //  mock
        },
      ],
    }).compile();

    service = module.get<CooperativeService>(CooperativeService);
    repo = module.get<Repository<Cooperative>>(getRepositoryToken(Cooperative));
  });

  it('should create a cooperative', async () => {
    const createDto = {
      commune: 'Carthage',
      gouvernorat: 'Tunis',
      telephone: '12345678',
      adresse: 'Rue Exemple',
      responsable: 'Abir',
    };

    const savedCoop = { id: 1, ...createDto, nom: `Cooperative Agricole Tunis` };
    mockRepo.save.mockResolvedValue(savedCoop);

    const result = await service.create(createDto);
    expect(result).toEqual(savedCoop);
    expect(mockRepo.save).toHaveBeenCalled();
  });

  it('should find all cooperatives', async () => {
    const coops = [{ id: 1 }, { id: 2 }];
    mockRepo.find.mockResolvedValue(coops);

    const result = await service.findAll();
    expect(result).toEqual(coops);
    expect(mockRepo.find).toHaveBeenCalled();
  });

  it('should throw NotFoundException if cooperative not found', async () => {
    mockRepo.findOne.mockResolvedValue(null);
    await expect(service.findOne(1)).rejects.toThrow('Cooperative non trouvée');
  });
});
