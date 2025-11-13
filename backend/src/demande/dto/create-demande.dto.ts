import { IsNotEmpty, IsEmail, IsNumber, IsString } from 'class-validator';

export class CreateDemandeDto {
  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsString()
  @IsNotEmpty()
  prenom: string;

  @IsString()
  @IsNotEmpty()
  telephone: string;

  @IsEmail()
  email: string;

  @IsString()
  adresse: string;

  @IsString()
  region: string;

  // لازم تكون رقمية وإلا يصير الغلط متاعك
  @IsNumber()
  superficieFerme: number;

  @IsNumber()
  nombreVaches: number;

  @IsString()
  role: string;
}
