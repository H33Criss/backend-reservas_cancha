import { forwardRef, Module } from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { ReservasController } from './reservas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserva } from './entities/reserva.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ReservasSocketModule } from '../reservas-socket/reservas_socket.module';
import { BloqueosModule } from 'src/bloqueos/bloqueos-rest/bloqueos.module';

@Module({
  controllers: [ReservasController],
  providers: [ReservasService],
  exports: [ReservasService],
  imports: [
    forwardRef(() => ReservasSocketModule),
    AuthModule,
    BloqueosModule,
    TypeOrmModule.forFeature([Reserva]),
  ],
})
export class ReservasModule {}
