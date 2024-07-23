import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Bloqueo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tipo: string; // Agrega el tipo 'hora' para bloquear horas específicas

  @Column({ type: 'date', nullable: true })
  dia?: Date; // Fecha específica bloqueada (si el tipo es 'dia' o 'hora')

  @Column({ type: 'date', nullable: true })
  semanaInicio?: Date; // Fecha de inicio de la semana bloqueada (si el tipo es 'semana')

  @Column({ type: 'date', nullable: true })
  semanaFin?: Date; // Fecha de fin de la semana bloqueada (si el tipo es 'semana')

  @Column({ nullable: true })
  horaInicio?: string; // Hora de inicio del bloqueo (si el tipo es 'hora')

  @Column({ nullable: true })
  horaFin?: string; // Hora de fin del bloqueo (si el tipo es 'hora')
}
