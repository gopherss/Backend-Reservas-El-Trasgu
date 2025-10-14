import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'email@example.com', description: 'Min 2 caracteres' })
  @IsNotEmpty()
  @IsEmail()
  user: string;

  @ApiProperty({ example: 'supersecreto', description: 'Contraseña del usuario' })
  @IsNotEmpty()
  password: string;
}
