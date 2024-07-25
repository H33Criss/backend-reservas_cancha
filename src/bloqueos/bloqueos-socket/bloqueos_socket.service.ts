import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GetBloqueosDto } from './dto/get-bloqueos.dto';
import { Server } from 'socket.io';
import { BloqueosService } from '../bloqueos-rest/bloqueos.service';
import { Bloqueo } from '../bloqueos-rest/entities/bloqueo.entity';
import { getStartAndEndOfWeek } from '../../utils';
@Injectable()
export class BloqueosSocketService {
  private wss: Server;
  setServer(server: Server) {
    this.wss = server;
  }
  constructor(
    @Inject(forwardRef(() => BloqueosService))
    private readonly bloqueosService: BloqueosService,
  ) { }
  async getBloqueosBySemana(
    getBloqueosDto: GetBloqueosDto,
  ): Promise<Bloqueo[]> {
    const { inicio, fin } = getBloqueosDto;
    const bloqueos = await this.bloqueosService.getBloqueosBySemana(
      new Date(inicio),
      new Date(fin),
    );
    return bloqueos;
  }

  async addBloqueo(newBloqueo: Bloqueo) {
    // Emitir evento de nuevo bloqueo a los clientes dentro del rango de fechas
    const { start, end } = getStartAndEndOfWeek(
      newBloqueo.dia ?? newBloqueo.semanaInicio,
    );
    if (this.wss) {
      this.wss.to(`bloqueos-${start}-${end}`).emit('nuevoBloqueo', newBloqueo);
    } else {
      console.error('WebSocket server not initialized');
    }
  }
}
