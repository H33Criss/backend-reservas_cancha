import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reserva } from './entities/reserva.entity';
import { AuthModule } from '../auth/auth.module';
import { BloqueosModule } from '../bloqueos/bloqueos-rest/bloqueos.module';
import { ReservasController } from './rest/reservas_rest.controller';
import { ReservasSocketService } from './socket/reservas_socket.service';
import { ReservasSocketGateway } from './socket/reservas_socket.gateway';
import { ReservasService } from './rest/reservas_rest.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Reserva]),
        AuthModule,
        BloqueosModule,
        forwardRef(() => ReservasModule),
    ],
    controllers: [ReservasController],
    providers: [
        ReservasService,
        ReservasSocketService,
        ReservasSocketGateway,
    ],
    exports: [ReservasService, ReservasSocketService],
})
export class ReservasModule { }
