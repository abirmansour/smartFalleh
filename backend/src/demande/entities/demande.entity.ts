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

  // ⚠️ لازم تكون رقمية
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
}
