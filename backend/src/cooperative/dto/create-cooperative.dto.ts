import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCooperativeDto {
  @IsNotEmpty()
  gouvernorat: string;

  @IsNotEmpty()
  commune: string;

  @IsOptional()
  responsable?: string;

  @IsNotEmpty()
  telephone: string;

  @IsNotEmpty()
  adresse: string;
}
