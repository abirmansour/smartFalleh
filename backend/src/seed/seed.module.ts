// src/seed/seed.module.ts
import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AdminSeed } from './admin.seed';

@Module({
  imports: [UsersModule],
  providers: [AdminSeed],
})
export class SeedModule {}
