import { Test, TestingModule } from '@nestjs/testing';
import { DemandesController } from './demande.controller';
import { DemandesService } from './demande.service';

describe('DemandeController', () => {
  let controller: DemandesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DemandesController],
      providers: [DemandesService],
    }).compile();

    controller = module.get<DemandesController>(DemandesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
