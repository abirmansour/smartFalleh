import { Module } from '@nestjs/common';
import { CooperativeService } from './cooperative.service';
import { CooperativeController } from './cooperative.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cooperative } from './entities/cooperative.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cooperative])],
  controllers: [CooperativeController],
  providers: [CooperativeService],
})
export class CooperativeModule {}
