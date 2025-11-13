import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateDemandeDto } from './dto/create-demande.dto';
import { Demande } from './entities/demande.entity';

@Injectable()
export class DemandesService {
  constructor(
    @InjectRepository(Demande)
    private demandeRepository: Repository<Demande>,
  ) {}

  async create(createDemandeDto: CreateDemandeDto): Promise<Demande> {
    const numeroDemande = 'DEM-' + Math.random().toString(36).substring(2, 10);
    const demande = this.demandeRepository.create({
      ...createDemandeDto,
      numeroDemande,
    });
    return await this.demandeRepository.save(demande);
  }

  findAll(): Promise<Demande[]> {
    return this.demandeRepository.find();
  }
}
