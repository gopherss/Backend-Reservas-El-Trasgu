import { IsDateString, IsInt, IsOptional, IsString } from "class-validator";

export class CreateReservationDto {
    @IsDateString() fechaReserva: string;
    @IsDateString() horaReserva: string;
    @IsInt() cantidadPersonas: number;
    @IsOptional() @IsString() alergias?: string;
    @IsOptional() @IsString() comentarios?: string;
    @IsInt() clientId: number;
    @IsInt() areaId: number;
    @IsInt() subareaId: number;
    @IsOptional() @IsInt() hostId?: number;
}
