import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'user_trasgu', description: 'Min 2 caracteres' })
  @IsNotEmpty()
  @MinLength(2)
  user: string;

  @ApiProperty({ example: 'supersecreto', description: 'Contraseña del usuario' })
  @IsNotEmpty()
  password: string;
}
