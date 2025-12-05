import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateDemandeDto } from './dto/create-demande.dto';
import { Demande } from './entities/demande.entity';
import { UpdateDemandeDto } from './dto/update-demande.dto';

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

  findOne(id: string): Promise<Demande | null> {
    return this.demandeRepository.findOne({ where: { uid :id } });
  }

  //find by email
  findByEmail(email: string): Promise<Demande | null> {
    return this.demandeRepository
        .createQueryBuilder('demande')
        .where('LOWER(demande.email) = LOWER(:email)', { email })
        .getOne();
  }

  async update(id: string, updateDemandeDto: UpdateDemandeDto, userId?: string): Promise<Demande> {
    const demande = await this.demandeRepository.findOne({ where: { uid: id } });
    if (!demande) {
      throw new NotFoundException(`Demande with ID ${id} not found`);
    }

    // If this is a validation update, set the validatedAt and validatedBy fields
    if (updateDemandeDto.eligible !== undefined) {
      updateDemandeDto.validatedAt = new Date();
      if (userId) {
        updateDemandeDto.validatedBy = userId;
      }
      // Update status based on eligibility
      updateDemandeDto.statut = updateDemandeDto.eligible ? 'Validé' : 'Refusé';
    }

    Object.assign(demande, updateDemandeDto);
    return this.demandeRepository.save(demande);
  }
}
