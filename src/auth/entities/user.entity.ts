import { Reserva } from 'src/reservas/reservas-rest/entities/reserva.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  fullName: string;

  @Column('text', {
    select: false,
  })
  password: string;

  @Column('text', {
    array: true,
    default: ['user'],
  })
  roles: string[];

  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  @Column()
  email: string;

  @OneToMany(() => Reserva, (reserva) => reserva.user)
  reservas: Reserva[];
}
