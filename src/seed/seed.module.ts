import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { AuthModule } from '../auth/auth.module';

import { BloqueosModule } from '../bloqueos/bloqueos-rest/bloqueos.module';
import { ReservasModule } from '../reservas/reservas.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [ReservasModule, AuthModule, BloqueosModule],
})
export class SeedModule { }
