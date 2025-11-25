import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { SeedModule } from './seed/seed.module';
import { CooperativeModule } from './cooperative/cooperative.module';
import { Cooperative } from './cooperative/entities/cooperative.entity';
import { DemandeModule } from './demande/demande.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true, //
      entities: [User, Cooperative],
    }),

    UsersModule,
    AuthModule,
    SeedModule,
    CooperativeModule,
    DemandeModule,
  ],
})
export class AppModule {}
