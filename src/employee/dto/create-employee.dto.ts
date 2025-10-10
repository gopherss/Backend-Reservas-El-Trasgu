import { Cargo } from "@prisma/client";
import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsEmail, IsEnum, IsInt, IsNotEmpty, IsOptional, IsPhoneNumber, IsPositive, IsString, MaxLength, minLength, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmployeeDto {
    @ApiProperty({ example: 'Juan', description: 'Nombre del empleado' })
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @ApiProperty({ example: 'Pérez', description: 'Apellido del empleado' })
    @IsString()
    @IsNotEmpty()
    apellido: string;

    @ApiProperty({ example: '12345678', description: 'DNI del empleado (8 dígitos)' })
    @IsString()
    @MinLength(8)
    @MaxLength(8)
    dni: string;

    @ApiProperty({ example: '+51987654321', description: 'Teléfono del empleado en formato internacional' })
    @IsString()
    @IsPhoneNumber()
    telefono: string;

    @ApiProperty({ example: 'juan.perez@example.com', description: 'Correo electrónico del empleado' })
    @IsEmail()
    @IsNotEmpty()
    correo: string;

    @ApiProperty({ enum: Cargo, description: 'Cargo del empleado' })
    @IsEnum(Cargo)
    cargo: Cargo;

    @ApiProperty({ example: '2025-10-09T00:00:00.000Z', description: 'Fecha de ingreso del empleado', type: String })
    @IsDate()
    @Type(() => Date)
    fecha_ingreso: Date;

    @ApiProperty({ example: true, description: 'Estado activo/inactivo del empleado, opcional' })
    @IsBoolean()
    @IsOptional()
    estado: boolean;

    @ApiProperty({ example: 1, description: 'ID del usuario asociado al empleado' })
    @IsInt()
    @IsNotEmpty()
    @IsPositive()
    userId: number;

}