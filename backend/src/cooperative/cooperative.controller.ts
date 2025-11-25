import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CooperativeService } from './cooperative.service';
import { CreateCooperativeDto } from './dto/create-cooperative.dto';
import { UpdateCooperativeDto } from './dto/update-cooperative.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('cooperatives')
export class CooperativeController {
  constructor(private readonly coopService: CooperativeService) {}

  @Post()
  create(@Body() createDto: CreateCooperativeDto) {
    return this.coopService.create(createDto);
  }

  @Get()
  findAll() {
    return this.coopService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.coopService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateDto: UpdateCooperativeDto) {
    return this.coopService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.coopService.remove(id);
  }
}
