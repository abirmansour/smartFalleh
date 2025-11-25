import { Test, TestingModule } from '@nestjs/testing';
import { DemandesService } from './demande.service';

describe('DemandeService', () => {
  let service: DemandesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DemandesService],
    }).compile();

    service = module.get<DemandesService>(DemandesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
