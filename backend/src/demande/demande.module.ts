import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DemandesService } from './demande.service';
import { Demande } from './entities/demande.entity';
import { DemandesController } from './demande.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Demande]), 
   forwardRef(() => UsersModule)
  ],
  providers: [DemandesService],
  controllers: [DemandesController],
  exports: [DemandesService],
})
export class DemandeModule {}
