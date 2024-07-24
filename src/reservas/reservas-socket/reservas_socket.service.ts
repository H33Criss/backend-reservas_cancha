import { Injectable } from '@nestjs/common';
import { forwardRef, Inject } from '@nestjs/common';

import { GetReservasDto } from './dto/get-reservas.dto';
import { Server } from 'socket.io';
import { getStartAndEndOfWeek, normalizeDates } from 'src/utils';
import { ReservasService } from '../reservas-rest/reservas.service';
import { Reserva } from '../reservas-rest/entities/reserva.entity';

@Injectable()
export class ReservasSocketService {
  private wss: Server;
  setServer(server: Server) {
    this.wss = server;
  }
  constructor(
    @Inject(forwardRef(() => ReservasService))
    private readonly reservasService: ReservasService,
  ) { }

  async getReservasBySemana(getReservasDto: GetReservasDto) {
    const { inicio, fin } = getReservasDto;

    const reservas = await this.reservasService.getReservasBySemana(
      normalizeDates.createDate(
        parseInt(inicio.split('-')[0]),
        parseInt(inicio.split('-')[1]),
        parseInt(inicio.split('-')[2]),
      ),
      normalizeDates.createDate(
        parseInt(fin.split('-')[0]),
        parseInt(fin.split('-')[1]),
        parseInt(fin.split('-')[2]),
      ),
    );
    return reservas;
  }

  async addReserva(newReserva: ReservaResponse) {
    // Emitir evento de nueva reserva a los clientes dentro del rango de fechas
    const { start, end } = getStartAndEndOfWeek(newReserva.fechaReserva);
    if (this.wss) {
      const room = `reservas-${start}-${end}`;
      console.log(`Room AddReserva: ${room}`);
      this.wss.to(room).emit('nuevaReserva', newReserva);
    } else {
      console.error('WebSocket server not initialized');
    }
    // return newReserva;
  }
}
