import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { Cooperative } from '../cooperative/entities/cooperative.entity';
import { randomBytes } from 'crypto'; 

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Cooperative)
    private cooperativeRepository: Repository<Cooperative>,

    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  // 🟢 Création utilisateur
  async create(createUserDto: CreateUserDto) {
    const { cooperativeId, ...rest } = createUserDto;

    // 🧩 Générer mot de passe temporaire si non fourni
    const tempPassword = rest.password || 'Temp@123';
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // 👤 Création de l'utilisateur
    const user = this.userRepository.create({
      ...rest,
      password: hashedPassword,
      role: rest.role || 'agriculteur',
      etat: rest.role === 'admin' ? 'active' : 'inactive',
    });

    // 🌿 Association à une coopérative (si donnée)
    let coopName: string | null = null;
    if (cooperativeId) {
      const coop = await this.cooperativeRepository.findOneBy({
        uid: cooperativeId,
      });
      if (!coop) throw new Error('Coopérative introuvable');

      user.cooperative = coop;
      coop.responsable = `${user.nom} ${user.prenom}`;
      await this.cooperativeRepository.save(coop);
      coopName = coop.nom;
    }

    const savedUser = await this.userRepository.save(user);

    // 🔗 Liens utiles
    const token = this.jwtService.sign(
      { email: savedUser.email },
      { expiresIn: '2h' },
    );
    const resetLink = `${process.env.FRONT_URL}/reset-password?token=${token}`;
    const siteLink = `${process.env.FRONT_URL}`;

    // ✉️ Envoi d'email selon le rôle
    try {
      if (savedUser.role === 'responsable') {
        await this.mailService.sendResponsableAssignationEmail(
          savedUser.email,
          savedUser.nom,
          savedUser.prenom,
          coopName || 'votre coopérative',
          tempPassword,
          resetLink,
        );
      } else if (savedUser.role === 'jury') {
        await this.mailService.sendJuryCreatedEmail(
          savedUser.email,
          savedUser.nom,
          savedUser.prenom,
          tempPassword,
          resetLink,
        );
      } else {
        await this.mailService.sendVerificationEmail(
          savedUser.email,
          resetLink,
          siteLink,
        );
      }
    } catch (error) {
      console.error(
        `❌ Erreur lors de l'envoi d'email à ${savedUser.email}:`,
        error.message,
      );
    }

    // Remove sensitive information before returning
    delete (savedUser as any).password;
    return savedUser;
  }

  // 🔁 Demande de réinitialisation du mot de passe
  async requestPasswordReset(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new BadRequestException('Email non trouvé');

    // ✅ Génération du token aléatoire
    const token = randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 3600_000); // 1h
    await this.userRepository.save(user);

    // 🔗 Lien vers le front
    const linkReset = `${process.env.FRONT_URL}/reset-password?token=${token}`;

    // 📧 Envoi de l'email
    await this.mailService.sendResetPasswordEmail(user.email, linkReset);

    // ✅ Retourne aussi le lien (utile pour debug)
    return {
      message: '📧 Email envoyé pour réinitialiser le mot de passe',
      link: linkReset,
    };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.userRepository.findOne({
      where: { resetPasswordToken: token },
    });
    if (!user) throw new BadRequestException('Lien invalide');

    if (!user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      throw new BadRequestException('Lien expiré');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await this.userRepository.save(user);

    return { message: '✅ Mot de passe réinitialisé avec succès' };
  }

  async updateProfile(uid: string, updateProfileDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { uid } });
    if (!user) throw new BadRequestException('Utilisateur non trouvé');

    // إذا بَدّل كلمة السر
    if (updateProfileDto.password) {
      updateProfileDto.password = await bcrypt.hash(
        updateProfileDto.password,
        10,
      );
    }

    Object.assign(user, updateProfileDto);
    return await this.userRepository.save(user);
  }

  // 📋 Liste
  findAll() {
    return this.userRepository.find();
  }

  // 🔎 Trouver par UID
  async findOne(uid: string) {
    const user = await this.userRepository.findOneBy({ uid });
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    return user;
  }

  // ✏️ Modifier
  async update(uid: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(uid);
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  // 🗑️ Supprimer
  async remove(uid: string) {
    const user = await this.findOne(uid);
    return this.userRepository.remove(user);
  }

  // 📧 Trouver par email
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  // 📧 Trouver par email (inclut mot de passe)
  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }
}
