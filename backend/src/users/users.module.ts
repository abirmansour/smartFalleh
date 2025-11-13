import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { MailService } from 'src/mail/mail.service';
import { JwtModule } from '@nestjs/jwt';
import { Cooperative } from 'src/cooperative/entities/cooperative.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Cooperative]),
  JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey', // ⚙️ مفتاح التوقيع
      signOptions: { expiresIn: '1h' },
    }),
  
],
  controllers: [UsersController],
  providers: [UsersService, MailService],
  exports: [UsersService],
})
export class UsersModule {}
