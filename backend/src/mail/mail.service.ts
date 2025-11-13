import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: { rejectUnauthorized: false },
    });
  }

  // 📩 1. Vérification initiale (email d’inscription)
  async sendVerificationEmail(email: string, linkReset: string, linkSite: string) {
    const templatePath = join(process.cwd(), 'src', 'mail', 'templates', 'email-template.html');
    let html = readFileSync(templatePath, 'utf8');

    html = html.replace('{{linkReset}}', linkReset);
    html = html.replace('{{linkSite}}', linkSite);

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        subject: 'Bienvenue sur SmartFalleh 🌾 - Vérifiez votre compte',
        html,
      });
      this.logger.log(`✅ Email de vérification envoyé à ${email}`);
    } catch (error) {
      this.logger.error(`❌ Erreur d'envoi: ${error.message}`);
    }
  }

  // 🔐 2. Email Reset Password
  async sendResetPasswordEmail(email: string, linkReset: string) {
    const templatePath = join(process.cwd(), 'src', 'mail', 'templates', 'email-template.html');
    let html = readFileSync(templatePath, 'utf8');

    html = html
      .replace('Bienvenue sur SmartFalleh 🌾', 'Réinitialisation du mot de passe 🔒')
      .replace(
        'Votre compte a été créé avec succès sur la plateforme SmartFalleh. Veuillez choisir une action ci-dessous :',
        "Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour en définir un nouveau :"
      )
      .replace('{{linkReset}}', linkReset)
      .replace('{{linkSite}}', process.env.FRONT_URL || '#');

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        subject: '🔐 Réinitialisation du mot de passe - SmartFalleh',
        html,
      });
      this.logger.log(`✅ Email de réinitialisation envoyé à ${email}`);
    } catch (error) {
      this.logger.error(`❌ Erreur envoi reset password: ${error.message}`);
    }
  }

  // ✅ 3. Email d’acceptation du jury
 async sendJuryCreatedEmail(
  email: string,
  nom: string,
  prenom: string,
  tempPassword: string,
  resetLink: string
) {
  const html = `
    <div style="font-family:'Poppins',Arial,sans-serif;background:#f9fafb;padding:30px;">
      <div style="max-width:600px;margin:auto;background:white;border-radius:12px;padding:30px;border-top:6px solid #4caf50;">
        <h2 style="color:#2e7d32;">👋 Bonjour ${prenom} ${nom},</h2>
        <p style="font-size:16px;color:#333;line-height:1.6;">
          Un compte a été créé pour vous sur la plateforme <strong>SmartFalleh</strong> en tant que <strong>jury</strong>.
        </p>
        <p style="font-size:15px;color:#555;line-height:1.6;">
          Voici vos informations de connexion :
        </p>
        <div style="background:#f1f8e9;padding:15px;border-radius:8px;margin:20px 0;">
          <p><strong>Email :</strong> ${email}</p>
          <p><strong>Mot de passe temporaire :</strong> ${tempPassword}</p>
        </div>
        <p style="font-size:15px;color:#555;line-height:1.6;">
          Vous pouvez modifier votre mot de passe à tout moment en cliquant sur le lien ci-dessous :
        </p>
        <div style="text-align:center;margin-top:25px;">
          <a href="${resetLink}" 
             style="background-color:#4caf50;color:white;text-decoration:none;
             padding:12px 24px;border-radius:6px;font-weight:bold;">
             🔐 Changer mon mot de passe
          </a>
        </div>
        <p style="color:#666;font-size:14px;margin-top:25px;text-align:center;">
          Merci pour votre engagement au sein de SmartFalleh 🌾
        </p>
      </div>
    </div>
  `;

  try {
    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: "🎉 Votre compte Jury a été créé - SmartFalleh",
      html,
    });
    this.logger.log(`✅ Email de création envoyé à ${email}`);
  } catch (error) {
    this.logger.error(`❌ Erreur envoi mail jury: ${error.message}`);
  }
}



  async sendResponsableAssignationEmail(
  email: string,
  nom: string,
  prenom: string,
  coopName: string,
  tempPassword: string,
  resetLink: string
) {
  const html = `
    <div style="font-family:Poppins,Arial,sans-serif;background:#f5f9f5;padding:20px;">
      <div style="background:white;border-radius:10px;padding:30px;max-width:600px;margin:auto;border-top:6px solid #4caf50;">
        <h2 style="color:#388e3c;">🌿 Affectation en tant que Responsable</h2>
        <p>Bonjour <strong>${prenom} ${nom}</strong>,</p>
        <p>
          Félicitations 🎉 ! Vous avez été affecté en tant que <strong>Responsable</strong>
          de la coopérative <strong>${coopName}</strong>.
        </p>
        <p>Voici vos informations de connexion provisoires :</p>
        <ul>
          <li><strong>Email :</strong> ${email}</li>
          <li><strong>Mot de passe temporaire :</strong> ${tempPassword}</li>
        </ul>
        <p>
          Pour des raisons de sécurité, veuillez modifier votre mot de passe dès que possible
          en cliquant sur le lien ci-dessous :
        </p>
        <p style="text-align:center;">
          <a href="${resetLink}" style="background:#4caf50;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;">
            🔐 Changer mon mot de passe
          </a>
        </p>
        <p style="color:#666;font-size:14px;">Merci pour votre engagement au sein de SmartFalleh 🌾</p>
      </div>
    </div>
  `;

  try {
    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: `🌿 Affectation en tant que Responsable - ${coopName}`,
      html,
    });
    this.logger.log(`✅ Email d'affectation envoyé à ${email}`);
  } catch (error) {
    this.logger.error(`❌ Erreur envoi email responsable: ${error.message}`);
  }
}

}
