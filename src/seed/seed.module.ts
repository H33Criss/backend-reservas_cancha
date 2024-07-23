import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { AuthModule } from '../auth/auth.module';
import { ReservasModule } from 'src/reservas/reservas-rest/reservas.module';
import { BloqueosModule } from 'src/bloqueos/bloqueos-rest/bloqueos.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [ReservasModule, AuthModule, BloqueosModule],
})
export class SeedModule {}
