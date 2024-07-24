import { IsDate, IsDateString, IsNumber, IsString } from 'class-validator';

export class BaseReservaDto {
  @IsString()
  diaSemana: string;

  @IsString()
  horaInicio: string;

  @IsString()
  horaFin: string;

  @IsNumber()
  coste: number;
}

export class CreateReservaDto extends BaseReservaDto {
  @IsDateString()
  fechaReserva: string;
}
export class CreateReservaServiceDto extends BaseReservaDto {
  @IsDate()
  fechaReserva: Date;
}
