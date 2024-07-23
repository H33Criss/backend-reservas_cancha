import { forwardRef, Module } from '@nestjs/common';
import { ReservasSocketService } from './reservas_socket.service';
import { ReservasSocketGateway } from './reservas_socket.gateway';
import { ReservasModule } from '../reservas-rest/reservas.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [ReservasSocketGateway, ReservasSocketService],
  exports: [ReservasSocketService],
  imports: [forwardRef(() => ReservasModule), AuthModule],
})
export class ReservasSocketModule { }
