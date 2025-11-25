import { Controller, Get, Post, Body } from '@nestjs/common';

import { CreateDemandeDto } from './dto/create-demande.dto';
import { DemandesService } from './demande.service';
@Controller('demandes')
export class DemandesController {
  constructor(private readonly demandesService: DemandesService) {}

  @Post()
  create(@Body() createDemandeDto: CreateDemandeDto) {
    return this.demandesService.create(createDemandeDto);
  }

  @Get()
  findAll() {
    return this.demandesService.findAll();
  }
}
