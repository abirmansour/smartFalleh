import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('demande')
export class Demande {
  @PrimaryGeneratedColumn('uuid')
  uid: string;

  @Column()
  nom: string;

  @Column()
  prenom: string;

  @Column()
  telephone: string;

  @Column()
  email: string;

  @Column()
  adresse: string;

  @Column()
  region: string;

  @Column('float')
  superficieFerme: number;

  @Column('int')
  nombreVaches: number;

  @Column()
  role: string;

  @Column({ unique: true })
  numeroDemande: string;

  @Column({ default: 'En attente' })
  statut: string;

  @Column({ nullable: true })
  referenceVache?: string;

  @Column({ type: 'int', nullable: true })
  validateNombreVaches?: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'boolean', nullable: true })
  eligible?: boolean;

  @Column({ type: 'timestamp', nullable: true })
  validatedAt?: Date;

  @Column({ nullable: true })
  validatedBy?: string;
}
