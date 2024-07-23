interface ReservaResponse {
  id: string;
  fechaReserva: Date;
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
  coste: number;
  user: string; // Aquí 'user' es el ID del usuario en lugar del objeto completo
}
