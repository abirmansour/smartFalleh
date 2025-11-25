// src/seed/admin.seed.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AdminSeed implements OnModuleInit {
  constructor(private readonly usersService: UsersService) {}

  async onModuleInit() {
    console.log('🚀 Vérification du super admin...');
    const users = await this.usersService.findAll();

    const hasAdmin = users.some((u) => u.role === 'admin');

    if (!hasAdmin) {
      await this.usersService.create({
        nom: 'Super',
        prenom: 'Admin',
        email: 'admin@gmail.com',
        password: 'admin123',
        telephone: '22222222', // sera hashé automatiquement
        role: 'admin',
      });

      console.log('✅ Super admin créé : admin@gmail.com / admin123');
    } else {
      console.log('ℹ️ Un admin existe déjà.');
    }
  }
}
