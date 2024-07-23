import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { User } from 'src/auth/entities/user.entity';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { normalizeDates } from 'src/utils';
import { Auth } from 'src/auth/decorators';

@Controller('reservas')
@Auth() // --> Este decorador habilita que funcione el @GetUser() de abajo
export class ReservasController {
  constructor(private readonly reservasService: ReservasService) { }

  @Post()
  create(@Body() createReservaDto: CreateReservaDto, @GetUser() user: User) {
    return this.reservasService.create(
      {
        ...createReservaDto,
        fechaReserva: normalizeDates.createDate(
          parseInt(createReservaDto.fechaReserva.split('-')[0]),
          parseInt(createReservaDto.fechaReserva.split('-')[1]),
          parseInt(createReservaDto.fechaReserva.split('-')[2]),
        ),
      },
      user,
    );
  }

  @Get(':id/user')
  findAllByUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.reservasService.findAllByUser(id);
  }

  @Get()
  findAll() {
    return this.reservasService.findAll();
  }

  @Get('semana')
  async getReservasBySemana(
    @Query('inicio') fechaInicio: string,
    @Query('fin') fechaFin: string,
  ) {
    return this.reservasService.getReservasBySemana(
      new Date(fechaInicio),
      new Date(fechaFin),
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReservaDto: UpdateReservaDto) {
    return this.reservasService.update(+id, updateReservaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservasService.remove(+id);
  }
}
