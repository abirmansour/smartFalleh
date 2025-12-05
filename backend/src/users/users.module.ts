import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { MailService } from '../mail/mail.service';
import { JwtModule } from '@nestjs/jwt';
import { Cooperative } from '../cooperative/entities/cooperative.entity';
import { DemandeModule } from '../demande/demande.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Cooperative]), forwardRef(() => DemandeModule),
    
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, MailService],
  exports: [UsersService],
})
export class UsersModule {}
