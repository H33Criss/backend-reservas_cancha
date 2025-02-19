import { Injectable } from '@nestjs/common';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { BloqueosService } from '../bloqueos/bloqueos-rest/bloqueos.service';
import { ReservasService } from '../reservas/rest/reservas_rest.service';

@Injectable()
export class SeedService {
  constructor(
    private readonly reservaService: ReservasService,
    private readonly bloqueosService: BloqueosService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async runSeed() {
    await this.deleteTables();
    const user = await this.insertNewUsers();
    await this.insertNewReservas(user);
    await this.insertBloqueos();
    return 'Seed Executed';
  }

  private async deleteTables() {
    await this.reservaService.deleteAllProducts();
    await this.bloqueosService.deleteAllProducts();
    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  private async insertNewUsers() {
    const seedUsers = initialData.users;
    const users: User[] = [];

    seedUsers.forEach((user) => {
      users.push(
        this.userRepository.create({
          ...user,
        }),
      );
    });

    const dbUsers = await this.userRepository.save(seedUsers);
    return dbUsers[0];
  }

  private async insertNewReservas(user: User) {
    const reservas = initialData.reservas;
    const insertPromises = [];

    reservas.forEach((r) => {
      insertPromises.push(this.reservaService.create(r, user));
    });

    await Promise.all(insertPromises);
  }
  private async insertBloqueos() {
    const bloqueos = initialData.bloqueos;
    const insertPromises = [];

    bloqueos.forEach((b) => {
      insertPromises.push(
        this.bloqueosService.create({
          ...b,
        }),
      );
    });

    await Promise.all(insertPromises);
  }
}
