import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  CreateReservaServiceDto,
} from '../dto/create-reserva.dto';
import { UpdateReservaDto } from '../dto/update-reserva.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reserva } from '../entities/reserva.entity';
import { Between, MoreThanOrEqual, Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { BloqueosService } from 'src/bloqueos/bloqueos-rest/bloqueos.service';
import { ReservasSocketService } from '../socket/reservas_socket.service';

@Injectable()
export class ReservasService {
  constructor(
    @InjectRepository(Reserva)
    private readonly reservaRepository: Repository<Reserva>,
    private readonly bloqueosService: BloqueosService,
    @Inject(forwardRef(() => ReservasSocketService))
    private readonly reservasSocketService: ReservasSocketService,
  ) { }

  async getReservasBySemana(
    fechaInicio: Date,
    fechaFin: Date,
  ): Promise<ReservaResponse[]> {
    const reservasData = await this.reservaRepository.find({
      where: {
        fechaReserva: Between(fechaInicio, fechaFin),
      },
      relations: ['user'], // Incluye las relaciones si necesitas más detalles
    });
    const reservas = reservasData.map((reserva) => ({
      ...reserva,
      user: reserva.user.id,
    }));
    return reservas;
  }
  async create(
    createReservaServiceDto: CreateReservaServiceDto,
    user: User,
  ): Promise<ReservaResponse> {

    const { fechaReserva } = createReservaServiceDto;


    // Verifica si el día está bloqueado
    const esBloqueado = await this.bloqueosService.esDiaBloqueado(fechaReserva);
    if (esBloqueado) {
      throw new BadRequestException(
        'No se pueden hacer reservas en esta fecha.',
      );
    }

    try {
      const reservaCreated = this.reservaRepository.create({
        ...createReservaServiceDto,

        user: user,
        // user: userReserva,
      });
      await this.reservaRepository.save(reservaCreated);
      const reserva = {
        ...reservaCreated,
        user: reservaCreated.user.id,
      };
      //Emitir con sockets
      await this.reservasSocketService.addReserva(reserva);
      return reserva;
    } catch (error) {
      this.handleDbExceptions(error);
    }
  }
  async findAllByUserAndDate(userId: string, today: Date) {
    const reservasData = await this.reservaRepository.find({
      where: {
        user: { id: userId },
        fechaReserva: MoreThanOrEqual(today)
      },
      order: {
        fechaReserva: 'ASC',
        horaInicio: 'ASC'
      },
      relations: ['user']
    });

    const reservas = reservasData.map((reserva) => ({
      ...reserva,
      user: reserva.user.id,
    }));
    return reservas;
  }

  findAllByUser(uid: string) {
    return this.reservaRepository.find({
      where: {
        user: { id: uid },
      },
      // relations: ['user'], // Incluye las relaciones si necesitas más detalles
    });
  }
  findAll() {
    return `This action returns all reservas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reserva`;
  }

  update(id: number, updateReservaDto: UpdateReservaDto) {
    return `This action updates a #${id} reserva`;
  }

  remove(id: number) {
    return `This action removes a #${id} reserva`;
  }

  private handleDbExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    // this.logger.error(error);
    throw new InternalServerErrorException(
      'Error inesperado, check logs del server.',
    );
  }

  async deleteAllProducts() {
    const query = this.reservaRepository.createQueryBuilder('reservas');
    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      this.handleDbExceptions(error);
    }
  }
}
