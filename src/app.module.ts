import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { SeedModule } from './seed/seed.module';
import { ReservasModule } from './reservas/reservas-rest/reservas.module';
import { ReservasSocketModule } from './reservas/reservas-socket/reservas_socket.module';
import { BloqueoSocketModule } from './bloqueos/bloqueos-socket/bloqueos_socket.module';
import { BloqueosModule } from './bloqueos/bloqueos-rest/bloqueos.module';

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.DB_PORT),
      database: process.env.POSTGRES_DATABASE,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      synchronize: true, // in prod should in false
      autoLoadEntities: true,
    }),
    ReservasModule,
    ReservasSocketModule,
    BloqueosModule,
    BloqueoSocketModule,
    AuthModule,
    SeedModule,
  ],
})
export class AppModule {}
