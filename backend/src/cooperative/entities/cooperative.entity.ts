import { User } from '../../users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('cooperatives')
export class Cooperative {
  [x: string]: any;
  @PrimaryGeneratedColumn('uuid')
  uid: string;

  @Column()
  nom: string; // généré automatiquement : "Cooperative Agricole {commune}"

  @Column()
  gouvernorat: string;

  @OneToMany(() => User, (user) => user.cooperative)
  responsables: User[];

  @Column({ nullable: true })
  responsable: string; //

  @Column()
  telephone: string;

  @Column()
  adresse: string;
}
