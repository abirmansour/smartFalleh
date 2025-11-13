import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateDemandeDto } from './dto/create-demande.dto';
import { DemandesService } from './demande.service';
import { Demande } from './entities/demande.entity';
import { DemandesController } from './demande.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Demande])],
  providers: [DemandesService],
  controllers: [DemandesController],
  exports: [DemandesService],
})
export class DemandeModule {}
