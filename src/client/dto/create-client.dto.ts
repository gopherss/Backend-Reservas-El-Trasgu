import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { TipoCliente } from "@prisma/client";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class CreateClientDto {
    @ApiProperty({
        description: 'Nombre del cliente',
        example: 'Juan',
    })
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @ApiProperty({
        description: 'Apellido del cliente',
        example: 'Pérez',
    })
    @IsString()
    @IsNotEmpty()
    apellido: string;

    @ApiProperty({
        description: 'Correo electrónico único del cliente',
        example: 'juan.perez@gmail.com',
    })
    @IsEmail()
    @IsNotEmpty()
    correo: string;

    @ApiProperty({
        description: 'Número de celular del cliente (incluyendo prefijo de país)',
        example: '+51987654321',
    })
    @IsPhoneNumber()
    @IsNotEmpty()
    celular: string;

    @ApiPropertyOptional({
        description: 'Tipo de cliente (INVITADO o REGISTRADO)',
        enum: TipoCliente,
        example: TipoCliente.INVITADO,
    })
    @IsOptional()
    @IsEnum(TipoCliente)
    tipoCliente?: TipoCliente;
}
