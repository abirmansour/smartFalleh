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
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;
    
    if (user.etat !== 'active') {
      throw new UnauthorizedException('Utilisateur inactif');
    }
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Génère le token JWT
  async login(user: any): Promise<{ 
    token: string;
    id: string;
    role: string;
    email: string;
  }> {
    const payload = { 
      email: user.email, 
      sub: user.uid || user.id,  // Handle both uid and id
      role: user.role 
    };
    
    return {
      token: this.jwtService.sign(payload),
      id: user.uid || user.id,  // Handle both uid and id
      role: user.role,
      email: user.email,
    };
  }

  // Logout avec blacklist (optionnel)
  async logout(token: string): Promise<{ message: string }> {
    // Si tu veux utiliser blacklist, ajoute le token
    return { message: 'Déconnecté avec succès' };
  }
}