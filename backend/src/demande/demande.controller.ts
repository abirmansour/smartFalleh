import { Controller, Get, Post, Body, Param, Put, Request } from '@nestjs/common';

import { CreateDemandeDto } from './dto/create-demande.dto';
import { DemandesService } from './demande.service';
import { UpdateDemandeDto } from './dto/update-demande.dto';
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

  @Get('email/:email')
  findByEmail(@Param('email') email: string) {
    return this.demandesService.findByEmail(email);
  }

  @Get(':id')
  findOneById(@Param('id') id: string) {
    return this.demandesService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDemandeDto: UpdateDemandeDto,
    @Request() req,
  ) {
    return this.demandesService.update(id, updateDemandeDto, req.user?.userId);
  }

}
