import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ReservasSocketService } from './reservas_socket.service';
import { Server, Socket } from 'socket.io';
import { GetReservasBySemanaDto } from '../dto/get-reservas-by-semana.dto';
import { AuthSocket, GetUser } from '../../auth/decorators';
import { WsExceptionLoggerFilter } from '../../common/handle-exceptions/socket-logger-filter.exception';
import { UseFilters } from '@nestjs/common';
import { GetReservasByUserDto } from '../dto/get-reservas-by-user.dto';

@AuthSocket()
@WebSocketGateway({ cors: true, namespace: 'reservas' })
@UseFilters(new WsExceptionLoggerFilter())
export class ReservasSocketGateway {
  constructor(private readonly reservasSocketService: ReservasSocketService) { }

  @WebSocketServer()
  wss: Server;

  afterInit(server: Server) {
    this.reservasSocketService.setServer(server);
  }

  @SubscribeMessage('reservasHorario')
  // @AuthSocket()
  async findAll(client: Socket, getReservasBySemanaDto: GetReservasBySemanaDto) {
    const data =
      await this.reservasSocketService.getReservasBySemana(getReservasBySemanaDto);

    const room = `reservas-${getReservasBySemanaDto.inicio}-${getReservasBySemanaDto.fin}`;
    client.join(room);
    client.emit('loadReservasHorario', data);
  }
  @SubscribeMessage('reservasProximas')
  async findByUser(client: Socket, getReservasByUserDto: GetReservasByUserDto) {
    const data = await this.reservasSocketService.findByUser(getReservasByUserDto);
    const roomUser = `user-${getReservasByUserDto.userId}`;
    client.join(roomUser);
    client.emit('loadReservasProximas', data);
  }


}
