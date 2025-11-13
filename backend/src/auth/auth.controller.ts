import { Controller, Post, Body, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  // Création d'un utilisateur
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // Login
  
 @Post('login')
async login(@Body() body: { email: string; password: string }) {
  const user = await this.authService.validateUser(body.email, body.password);
  
  if (!user) {
    throw new UnauthorizedException('Email ou mot de passe incorrect');
  }

  return this.authService.login(user);
}


  // Logout
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req) {
    const token = req.headers.authorization?.split(' ')[1];
    return this.authService.logout(token);
  }
}




