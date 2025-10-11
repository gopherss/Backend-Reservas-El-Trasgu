import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsInt, IsOptional, IsString } from "class-validator";

export class CreateSubareaDto {
    @ApiProperty({
        description: 'Nombre de la subárea (por ejemplo, Mesa 1 o Zona A)',
        example: 'Mesa 5',
    })
    @IsString()
    nombreSubarea: string;

    @ApiPropertyOptional({
        description: 'URL o ruta de la imagen de referencia para la subárea',
        example: 'https://miapp.com/uploads/subareas/mesa5.png',
    })
    @IsOptional()
    @IsString()
    imagenReferencia?: string;

    @ApiPropertyOptional({
        description: 'Indica si la subárea está activa o no',
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    estado?: boolean;

    @ApiProperty({
        description: 'Identificador del área a la que pertenece la subárea',
        example: 1,
    })
    @IsInt()
    areaId: number;
}
