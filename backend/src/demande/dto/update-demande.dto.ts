import { PartialType } from '@nestjs/mapped-types';
import { CreateDemandeDto } from './create-demande.dto';

export class UpdateDemandeDto extends PartialType(CreateDemandeDto) {
  referenceVache?: string;
  validateNombreVaches?: number;
  notes?: string;
  eligible?: boolean;
  validatedAt?: Date;
  validatedBy?: string;
  statut?: string;
}