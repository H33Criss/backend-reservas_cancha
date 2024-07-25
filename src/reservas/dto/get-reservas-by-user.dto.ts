import { IsDateString, IsUUID } from "class-validator";


export class GetReservasByUserDto {
    @IsUUID()
    userId: string;

    @IsDateString()
    today: string;
}
