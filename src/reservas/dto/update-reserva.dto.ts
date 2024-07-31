import { PartialType } from '@nestjs/mapped-types';
import { CreateReservaDto } from './create-reserva.dto';
import { IsBoolean } from 'class-validator';

export class UpdateReservaDto extends PartialType(CreateReservaDto) {

    @IsBoolean()
    pagada: boolean;
}
