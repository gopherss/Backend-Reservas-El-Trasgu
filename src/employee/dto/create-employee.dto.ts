import { ApiProperty } from '@nestjs/swagger';
import { Cargo } from "@prisma/client";
import { IsBoolean, IsEmail, IsEnum, IsInt, IsNotEmpty, IsOptional, IsPhoneNumber, IsPositive, IsString, MaxLength, MinLength } from "class-validator";

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

    
    @ApiProperty({ example: 'supersecreto', description: 'Contraseña del usuario asociado' })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({ enum: Cargo, description: 'Cargo del empleado' })
    @IsEnum(Cargo)
    cargo: Cargo;

    @ApiProperty({ example: true, description: 'Estado activo/inactivo del empleado, opcional' })
    @IsBoolean()
    @IsOptional()
    estado: boolean;

}