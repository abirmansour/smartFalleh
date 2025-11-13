import { IsEmail, IsString, MinLength, IsOptional, IsEnum, IsNumber, IsUUID } from 'class-validator';

export class CreateUserDto {
  @IsString()
  nom: string;

  @IsString()
  prenom: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  telephone?: string;

  @IsOptional()
  @IsString()
  adresse?: string;

 
 
  @IsEnum(['admin', 'agriculteur', 'jury', 'responsable'])
  @IsOptional()
  role?: string;

  @IsUUID()
  @IsOptional()
  cooperativeId?: string;
}
