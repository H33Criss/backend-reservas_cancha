import { forwardRef, Module } from '@nestjs/common';
import { BloqueosService } from './bloqueos.service';
import { BloqueosController } from './bloqueos.controller';
import { Bloqueo } from './entities/bloqueo.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BloqueoSocketModule } from '../bloqueos-socket/bloqueos_socket.module';

@Module({
  controllers: [BloqueosController],
  providers: [BloqueosService],
  exports: [BloqueosService],
  imports: [
    forwardRef(() => BloqueoSocketModule),
    TypeOrmModule.forFeature([Bloqueo]),
  ],
})
export class BloqueosModule {}
