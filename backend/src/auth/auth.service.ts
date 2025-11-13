import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // Vérifie si l'utilisateur existe et le mot de passe est correct
  async validateUser(email: string, password: string) {
   const user = await this.usersService.findByEmail(email);
if (!user) return null;
const isMatch = await bcrypt.compare(password, user.password);
if (!isMatch) return null;
if (user.etat !== 'active') throw new UnauthorizedException('Utilisateur inactif');
return user;

  }

  // Génère le token JWT
  async login(user: any) {
    const payload = { email: user.email, sub: user.uid, role: user.role };
    return {
      token: this.jwtService.sign(payload),
      id: user.uid,
      role: user.role,
      email: user.email,
    };
  }

  // Logout avec blacklist (optionnel)
  async logout(token: string) {
    // Si tu veux utiliser blacklist, ajoute le token
    return { message: 'Déconnecté avec succès' };
  }
}
