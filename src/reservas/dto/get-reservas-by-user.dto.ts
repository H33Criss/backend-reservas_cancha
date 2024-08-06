import { IsDateString, IsOptional, IsUUID } from "class-validator";


export class GetReservasByUserDto {
    @IsUUID()
    userId: string;

    @IsDateString()
    @IsOptional()
    today: string;
}
