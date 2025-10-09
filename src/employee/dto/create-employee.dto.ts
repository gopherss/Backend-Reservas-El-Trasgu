import { Cargo } from "@prisma/client";
import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsEmail, IsEnum, IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateEmployeeDto {
    @IsString()
    nombre: string;

    @IsString()
    apellido: string;

    @IsString()
    dni: string;

    @IsString()
    telefono: string;

    @IsEmail()
    correo: string;

    @IsEnum(Cargo)
    cargo: Cargo;

    @IsDate()
    @Type(() => Date)
    fecha_ingreso: Date;

    @IsDate()
    @Type(() => Date)
    fecha_registro: Date;

    @IsBoolean()
    estado: boolean;

    @IsInt()
    @IsNotEmpty()
    userId: number;
}

