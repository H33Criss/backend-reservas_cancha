import * as bcrypt from 'bcrypt';
import { normalizeDates } from 'src/utils';

interface SeedReserva {
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
  fechaReserva: Date;
  coste: number;
}

interface SeedUser {
  email: string;
  password: string;
  fullName: string;
  roles: string[];
}

interface SeedBloqueo {
  tipo: 'dia' | 'semana' | 'hora'; // Agrega el tipo 'hora' para bloquear horas específicas
  dia?: Date; // Fecha específica bloqueada (si el tipo es 'dia' o 'hora')
  semanaInicio?: Date; // Fecha de inicio de la semana bloqueada (si el tipo es 'semana')
  semanaFin?: Date; // Fecha de fin de la semana bloqueada (si el tipo es 'semana')
  horaInicio?: string; // Hora de inicio del bloqueo (si el tipo es 'hora')
  horaFin?: string; // Hora de fin del bloqueo (si el tipo es 'hora')
}

interface SeedData {
  bloqueos: SeedBloqueo[];
  reservas: SeedReserva[];
  users: SeedUser[];
}

export const initialData: SeedData = {
  users: [
    {
      email: 'test1@gmail.com',
      password: bcrypt.hashSync('Abc123', 10),
      fullName: 'Test1',
      roles: ['admin'],
    },
    {
      email: 'test2@gmail.com',
      password: bcrypt.hashSync('Abc123', 10),
      fullName: 'Test2',
      roles: ['user'],
    },
    {
      email: 'test3@gmail.com',
      password: bcrypt.hashSync('Abc123', 10),
      fullName: 'Test3',
      roles: ['admin', 'superuser'],
    },
  ],
  reservas: [
    {
      diaSemana: 'Lunes',
      horaInicio: '18:00',
      horaFin: '19:00',
      fechaReserva: normalizeDates.createDate(2024, 7, 8),
      coste: 10000,
    },
    {
      diaSemana: 'Lunes',
      horaInicio: '19:00',
      horaFin: '20:00',
      fechaReserva: normalizeDates.createDate(2024, 7, 8),
      coste: 10000,
    },
    {
      diaSemana: 'Martes',
      horaInicio: '20:00',
      horaFin: '21:00',
      fechaReserva: normalizeDates.createDate(2024, 7, 9),
      coste: 10000,
    },
    {
      diaSemana: 'Martes',
      horaInicio: '21:00',
      horaFin: '22:00',
      fechaReserva: normalizeDates.createDate(2024, 7, 9),
      coste: 10000,
    },
    {
      diaSemana: 'Miércoles',
      horaInicio: '18:00',
      horaFin: '19:00',
      fechaReserva: normalizeDates.createDate(2024, 7, 10),
      coste: 10000,
    },
    {
      diaSemana: 'Miércoles',
      horaInicio: '19:00',
      horaFin: '20:00',
      fechaReserva: normalizeDates.createDate(2024, 7, 10),
      coste: 10000,
    },
    {
      diaSemana: 'Jueves',
      horaInicio: '20:00',
      horaFin: '21:00',
      fechaReserva: normalizeDates.createDate(2024, 7, 11),
      coste: 10000,
    },
    {
      diaSemana: 'Jueves',
      horaInicio: '21:00',
      horaFin: '22:00',
      fechaReserva: normalizeDates.createDate(2024, 7, 11),
      coste: 10000,
    },
    {
      diaSemana: 'Viernes',
      horaInicio: '18:00',
      horaFin: '19:00',
      fechaReserva: normalizeDates.createDate(2024, 7, 12),
      coste: 10000,
    },
    {
      diaSemana: 'Viernes',
      horaInicio: '19:00',
      horaFin: '20:00',
      fechaReserva: normalizeDates.createDate(2024, 7, 12),
      coste: 10000,
    },
  ],

  bloqueos: [
    // Semana del 8 de julio al 14 de julio
    {
      tipo: 'dia',
      dia: normalizeDates.createDate(2024, 7, 8),
    },
    {
      tipo: 'semana',
      semanaInicio: normalizeDates.createDate(2024, 7, 8),
      semanaFin: normalizeDates.createDate(2024, 7, 14),
    },
    {
      tipo: 'hora',
      dia: normalizeDates.createDate(2024, 7, 10),
      horaInicio: '15:00',
      horaFin: '16:00',
    },
    {
      tipo: 'dia',
      dia: normalizeDates.createDate(2024, 7, 12),
    },
    {
      tipo: 'hora',
      dia: normalizeDates.createDate(2024, 7, 13),
      horaInicio: '09:00',
      horaFin: '10:00',
    },
    // Semana del 15 de julio al 21 de julio
    {
      tipo: 'dia',
      dia: normalizeDates.createDate(2024, 7, 15),
    },
    {
      tipo: 'semana',
      semanaInicio: normalizeDates.createDate(2024, 7, 15),
      semanaFin: normalizeDates.createDate(2024, 7, 21),
    },
    {
      tipo: 'hora',
      dia: normalizeDates.createDate(2024, 7, 16),
      horaInicio: '17:00',
      horaFin: '18:00',
    },
    {
      tipo: 'dia',
      dia: normalizeDates.createDate(2024, 7, 18),
    },
    {
      tipo: 'hora',
      dia: normalizeDates.createDate(2024, 7, 19),
      horaInicio: '11:00',
      horaFin: '12:00',
    },
    // Semana del 22 de julio al 28 de julio
    {
      tipo: 'dia',
      dia: normalizeDates.createDate(2024, 7, 22),
    },
    {
      tipo: 'semana',
      semanaInicio: normalizeDates.createDate(2024, 7, 22),
      semanaFin: normalizeDates.createDate(2024, 7, 28),
    },
    {
      tipo: 'hora',
      dia: normalizeDates.createDate(2024, 7, 24),
      horaInicio: '14:00',
      horaFin: '15:00',
    },
    {
      tipo: 'dia',
      dia: normalizeDates.createDate(2024, 7, 25),
    },
    {
      tipo: 'hora',
      dia: normalizeDates.createDate(2024, 7, 26),
      horaInicio: '13:00',
      horaFin: '14:00',
    },
    // Semana del 29 de julio al 4 de agosto
    {
      tipo: 'dia',
      dia: normalizeDates.createDate(2024, 7, 29),
    },
    {
      tipo: 'semana',
      semanaInicio: normalizeDates.createDate(2024, 7, 29),
      semanaFin: normalizeDates.createDate(2024, 8, 4),
    },
    {
      tipo: 'hora',
      dia: normalizeDates.createDate(2024, 7, 30),
      horaInicio: '08:00',
      horaFin: '09:00',
    },
    {
      tipo: 'dia',
      dia: normalizeDates.createDate(2024, 8, 1),
    },
    {
      tipo: 'hora',
      dia: normalizeDates.createDate(2024, 8, 2),
      horaInicio: '10:00',
      horaFin: '11:00',
    },
  ],
};
