import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { BloqueosSocketService } from './bloqueos_socket.service';
import { Server, Socket } from 'socket.io';
import { GetBloqueosDto } from './dto/get-bloqueos.dto';

@WebSocketGateway({ cors: true, namespace: 'bloqueos' })
@WebSocketGateway()
export class BloqueosSocketGateway {
  constructor(private readonly bloqueosSocketService: BloqueosSocketService) {}
  @WebSocketServer()
  wss: Server;

  afterInit(server: Server) {
    this.bloqueosSocketService.setServer(server);
  }
  @SubscribeMessage('loadBloqueos')
  async findAll(client: Socket, getBloqueosDto: GetBloqueosDto) {
    const data =
      await this.bloqueosSocketService.getBloqueosBySemana(getBloqueosDto);

    const room = `bloqueos-${getBloqueosDto.inicio}-${getBloqueosDto.fin}`;
    client.join(room);
    client.emit('loadedBloqueos', data);
  }
}
