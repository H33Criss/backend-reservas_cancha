import { User } from 'src/auth/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Reserva {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.reservas)
  user: User;

  @Column()
  diaSemana: string;

  @Column()
  horaInicio: string;

  @Column()
  horaFin: string;

  @Column({ type: 'date' })
  fechaReserva: Date;

  @Column({ default: false })
  pagada: boolean;

  @Column()
  coste: number;
}
