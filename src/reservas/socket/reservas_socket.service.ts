import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { GetReservasBySemanaDto } from '../dto/get-reservas-by-semana.dto';
import { Server } from 'socket.io';
import { getStartAndEndOfWeek, normalizeDates } from '../../utils';
import { ReservasService } from '../rest/reservas_rest.service';
import { GetReservasByUserDto } from '../dto/get-reservas-by-user.dto';


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

  async getReservasBySemana(GetReservasBySemanaDto: GetReservasBySemanaDto) {
    const { inicio, fin } = GetReservasBySemanaDto;

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
      const roomUser = `user-${newReserva.user}`;
      this.wss.to(room).emit('newReservaHorario', newReserva);
      this.wss.to(roomUser).emit(`newReservaProxima`, newReserva);
      this.wss.to(roomUser).emit(`newReserva-${newReserva.user}`, newReserva);
    } else {
      console.error('WebSocket server not initialized');
    }
    // return newReserva;
  }
  async updateReserva(updatedReserva: ReservaResponse) {

    if (this.wss) {
      this.wss.emit(`reserva-${updatedReserva.id}`, updatedReserva);
      this.wss.emit(`update-${updatedReserva.user}-reserva`, updatedReserva);
    } else {
      console.error('WebSocket server not initialized');
    }
  }

  async findByUser(getReservasByUserDto: GetReservasByUserDto, getAll: boolean) {
    const { userId, today } = getReservasByUserDto;

    if (getAll) {
      const reservas = await this.reservasService.findAllByUser(userId);
      return reservas;
    }
    const todayFormated = normalizeDates.createDate(
      parseInt(today.split('-')[0]),
      parseInt(today.split('-')[1]),
      parseInt(today.split('-')[2]),
    );
    const reservas = await this.reservasService.findAllByUserAndDate(userId, todayFormated);
    return reservas;
  }
}
