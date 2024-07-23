import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ReservasSocketService } from './reservas_socket.service';
import { Server, Socket } from 'socket.io';
import { GetReservasDto } from './dto/get-reservas.dto';
import { AuthSocket } from 'src/auth/decorators';
import { WsExceptionLoggerFilter } from 'src/common/handle-exceptions/socket-logger-filter.exception';
import { UseFilters } from '@nestjs/common';

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

  @SubscribeMessage('loadReservas')
  // @AuthSocket(ValidRoles.admin)
  async findAll(client: Socket, getReservasDto: GetReservasDto) {
    const data =
      await this.reservasSocketService.getReservasBySemana(getReservasDto);
    const room = `reservas-${getReservasDto.inicio}-${getReservasDto.fin}`;
    console.log(`Room Reservas: ${room}`);
    client.join(room);
    client.emit('loadedReservas', data);
  }
}
