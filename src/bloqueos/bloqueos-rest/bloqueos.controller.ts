import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { BloqueosService } from './bloqueos.service';
import {
  CreateBloqueoDto,
  CreateBloqueoServiceDto,
} from './dto/create-bloqueo.dto';
import { normalizeDates } from 'src/utils';

@Controller('bloqueos')
export class BloqueosController {
  constructor(private readonly bloqueosService: BloqueosService) {}

  @Post()
  create(@Body() createBloqueoDto: CreateBloqueoDto) {
    const proccessDto: CreateBloqueoServiceDto = {
      ...createBloqueoDto,
      dia: createBloqueoDto.dia
        ? normalizeDates.createDate(
            parseInt(createBloqueoDto.dia.split('-')[0]),
            parseInt(createBloqueoDto.dia.split('-')[1]),
            parseInt(createBloqueoDto.dia.split('-')[2]),
          )
        : undefined,
      semanaInicio: createBloqueoDto.semanaInicio
        ? normalizeDates.createDate(
            parseInt(createBloqueoDto.semanaInicio.split('-')[0]),
            parseInt(createBloqueoDto.semanaInicio.split('-')[1]),
            parseInt(createBloqueoDto.semanaInicio.split('-')[2]),
          )
        : undefined,
      semanaFin: createBloqueoDto.semanaFin
        ? normalizeDates.createDate(
            parseInt(createBloqueoDto.semanaFin.split('-')[0]),
            parseInt(createBloqueoDto.semanaFin.split('-')[1]),
            parseInt(createBloqueoDto.semanaFin.split('-')[2]),
          )
        : undefined,
    };

    return this.bloqueosService.create(proccessDto);
  }

  @Get('semana')
  async getBloqueosBySemana(
    @Query('inicio') fechaInicio: string,
    @Query('fin') fechaFin: string,
  ) {
    return this.bloqueosService.getBloqueosBySemana(
      normalizeDates.normalizeDate(fechaInicio),
      normalizeDates.normalizeDate(fechaFin),
    );
  }
}
