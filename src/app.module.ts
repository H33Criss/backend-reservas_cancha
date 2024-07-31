import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { SeedModule } from './seed/seed.module';

import { BloqueoSocketModule } from './bloqueos/bloqueos-socket/bloqueos_socket.module';
import { BloqueosModule } from './bloqueos/bloqueos-rest/bloqueos.module';
import { ReservasModule } from './reservas/reservas.module';

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      // ssl: process.env.STAGE === 'prod',
      // extra: {
      //   ssl:
      //     process.env.STAGE === 'prod' ? { rejectUnauthorized: false } : null,
      // },
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.DB_PORT),
      database: process.env.POSTGRES_DATABASE,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      synchronize: !(process.env.STAGE === 'prod'), // in prod should in false
      autoLoadEntities: true,
    }),
    ReservasModule,
    BloqueosModule,
    BloqueoSocketModule,
    AuthModule,
    SeedModule,
  ],
})
export class AppModule { }
