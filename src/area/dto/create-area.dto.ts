import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsInt, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class CreateAreaDto {
    @ApiProperty({
        description: 'Nombre del área (por ejemplo, Terraza o Salón VIP)',
        example: 'Terraza',
    })
    @IsString()
    nombreArea: string;

    @ApiProperty({
        description: 'Capacidad máxima de personas que puede albergar el área',
        example: 40,
    })
    @IsInt()
    @IsPositive()
    capacidadMaxima: number;

    @ApiPropertyOptional({
        description: 'Consumo mínimo requerido en el área (opcional)',
        example: 150.50,
    })
    @IsOptional()
    @IsNumber()
    consumoMinimo?: number;

    @ApiPropertyOptional({
        description: 'Descripción adicional del área',
        example: 'Área al aire libre con vista al jardín.',
    })
    @IsOptional()
    @IsString()
    descripcion?: string;

    @ApiPropertyOptional({
        description: 'Estado del área (activo o inactivo)',
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    estado?: boolean;
}
