import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 🟢 GET : Liste des utilisateurs
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // 🟢 GET : un utilisateur par UID
  @UseGuards(JwtAuthGuard)
  @Get(':uid')
  findOne(@Param('uid') uid: string) {
    return this.usersService.findOne(uid);
  }

  // 🟢 POST : création utilisateur
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // 🟠 PATCH : modification utilisateur
  @UseGuards(JwtAuthGuard)
  @Patch(':uid')
  update(@Param('uid') uid: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(uid, updateUserDto);
  }

  // 🔴 DELETE : suppression utilisateur
  @UseGuards(JwtAuthGuard)
  @Delete(':uid')
  remove(@Param('uid') uid: string) {
    return this.usersService.remove(uid);
  }

  @Post('request-password-reset')
async requestReset(@Body('email') email: string) {
  return this.usersService.requestPasswordReset(email);
}

@Post('reset-password')
async resetPassword(@Body() body: { token: string; newPassword: string }) {
  return this.usersService.resetPassword(body.token, body.newPassword);
}
 @UseGuards(JwtAuthGuard)
  @Patch(':uid/profile')
  async updateProfile(@Param('uid') uid: string, @Body() dto: UpdateUserDto) {
    return this.usersService.updateProfile(uid, dto);
  }
}
