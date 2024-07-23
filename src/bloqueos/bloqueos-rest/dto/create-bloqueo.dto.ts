import {
  IsDate,
  IsIn,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';

export class BaseBloqueoDto {
  @IsIn(['dia', 'semana', 'hora'])
  tipo: string;

  @IsOptional()
  horaInicio?: string;

  @IsOptional()
  horaFin?: string;
}

export class CreateBloqueoDto extends BaseBloqueoDto {
  @IsOptional()
  @IsDateString()
  dia?: string;

  @IsOptional()
  @IsDateString()
  semanaInicio?: string;

  @IsOptional()
  @IsDateString()
  semanaFin?: string;
}

export class CreateBloqueoServiceDto extends BaseBloqueoDto {
  @IsOptional()
  @IsDate()
  dia?: Date;

  @IsOptional()
  @IsDate()
  semanaInicio?: Date;

  @IsOptional()
  @IsDate()
  semanaFin?: Date;
}
