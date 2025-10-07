import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class RegisterDto {
    @ApiProperty({ example: 'test@mail.com', description: 'Correo electrónico del nuevo usuario' })
    @IsEmail()
    email: string;

    @ApiProperty({
        example: 'supersecreto',
        description: 'Contraseña del usuario (mínimo 6 caracteres)'
    })
    @IsNotEmpty()
    @MinLength(6, { message: 'la constraseña debe tener almenos 6 caracteres' })
    password: string;
}

