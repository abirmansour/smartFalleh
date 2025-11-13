// auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  // Vérifier email + password
  async validateUser(email: string, password: string) {
  const user = await this.usersService.findByEmail(email);
  if (!user) return null; // 🚨 si l'utilisateur n'existe pas

  // Vérifie le mot de passe
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return null; // 🚨 si le mot de passe est incorrect

  // Vérifie l'état du compte
  if (user.etat !== 'active') return null; // 🚨 si compte inactive
console.log({ user, isMatch, etat: user?.etat });
  return user;
}


  async login(user: any) {
    const payload = { email: user.email, sub: user.uid, role: user.role };
    return {
      token: this.jwtService.sign(payload),
      id: user.uid,
      email: user.email,
      role: user.role
    };
  }

  async logout(token: string) {
    // Ajouter le token à la blacklist si tu gères ça
    return { message: 'Déconnecté' };
  }
}
