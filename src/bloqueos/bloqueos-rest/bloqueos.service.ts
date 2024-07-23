import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Bloqueo } from './entities/bloqueo.entity';
import { BloqueosSocketService } from '../bloqueos-socket/bloqueos_socket.service';
import { CreateBloqueoServiceDto } from './dto/create-bloqueo.dto';

@Injectable()
export class BloqueosService {
  constructor(
    @InjectRepository(Bloqueo)
    private readonly bloqueoRepository: Repository<Bloqueo>,

    @Inject(forwardRef(() => BloqueosSocketService))
    private readonly bloqueosSocketService: BloqueosSocketService,
  ) {}

  async create(
    createBloqueoServiceDto: CreateBloqueoServiceDto,
  ): Promise<Bloqueo> {
    const bloqueo = this.bloqueoRepository.create({
      ...createBloqueoServiceDto,
    });
    await this.bloqueoRepository.save(bloqueo);
    await this.bloqueosSocketService.addBloqueo(bloqueo);
    return bloqueo;
  }

  async esDiaBloqueado(dia: Date): Promise<boolean> {
    const bloqueoDia = await this.bloqueoRepository.findOne({
      where: { tipo: 'dia', dia },
    });
    const bloqueoSemana = await this.bloqueoRepository
      .createQueryBuilder('bloqueo')
      .where('bloqueo.tipo = :tipo', { tipo: 'semana' })
      .andWhere('bloqueo.semanaInicio <= :dia', { dia })
      .andWhere('bloqueo.semanaFin >= :dia', { dia })
      .getOne();

    return !!bloqueoDia || !!bloqueoSemana;
  }

  async getBloqueosBySemana(
    fechaInicio: Date,
    fechaFin: Date,
  ): Promise<Bloqueo[]> {
    return this.bloqueoRepository.find({
      where: [
        { tipo: 'semana', semanaInicio: Between(fechaInicio, fechaFin) },
        { tipo: 'dia', dia: Between(fechaInicio, fechaFin) },
        { tipo: 'hora', dia: Between(fechaInicio, fechaFin) },
      ],
    });
  }
  private handleDbExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    // this.logger.error(error);
    throw new InternalServerErrorException(
      'Error inesperado en BLOQUEOS SERVICE, check logs del server.',
    );
  }
  async deleteAllProducts() {
    const query = this.bloqueoRepository.createQueryBuilder('bloqueos');
    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      this.handleDbExceptions(error);
    }
  }
}
