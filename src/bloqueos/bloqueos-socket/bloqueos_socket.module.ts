import { forwardRef, Module } from '@nestjs/common';
import { BloqueosSocketService } from './bloqueos_socket.service';
import { BloqueosSocketGateway } from './bloqueos_socket.gateway';
import { BloqueosModule } from '../bloqueos-rest/bloqueos.module';

@Module({
  providers: [BloqueosSocketGateway, BloqueosSocketService],
  exports: [BloqueosSocketService],
  imports: [forwardRef(() => BloqueosModule)],
})
export class BloqueoSocketModule {}
