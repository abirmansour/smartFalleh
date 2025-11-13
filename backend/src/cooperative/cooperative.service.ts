import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCooperativeDto } from './dto/create-cooperative.dto';
import { UpdateCooperativeDto } from './dto/update-cooperative.dto';
import { Cooperative } from './entities/cooperative.entity';

@Injectable()
export class CooperativeService {
  constructor(
    @InjectRepository(Cooperative)
    private readonly coopRepo: Repository<Cooperative>,
  ) {}

  async create(createDto: CreateCooperativeDto): Promise<Cooperative> {
    const coop = new Cooperative();
    coop.gouvernorat = createDto.gouvernorat;
    coop.nom = `Cooperative Agricole ${createDto.gouvernorat}`; // auto-généré
    coop.telephone = createDto.telephone;
    coop.adresse = createDto.adresse;
   coop.responsable = createDto.responsable || '';


    return this.coopRepo.save(coop);
  }

  findAll(): Promise<Cooperative[]> {
    return this.coopRepo.find();
  }

  async findOne(id: number): Promise<Cooperative> {
    const coop = await this.coopRepo.findOne({ where: { id } });
    if (!coop) throw new NotFoundException('Cooperative non trouvée');
    return coop;
  }

  async update(id: number, updateDto: UpdateCooperativeDto): Promise<Cooperative> {
    const coop = await this.findOne(id);

    Object.assign(coop, updateDto);

    // si commune est modifiée, regen le nom
    if (updateDto.commune) coop.nom = `Cooperative Agricole ${updateDto.commune}`;

    return this.coopRepo.save(coop);
  }

  async remove(id: number): Promise<void> {
    const coop = await this.findOne(id);
    await this.coopRepo.remove(coop);
  }
}
