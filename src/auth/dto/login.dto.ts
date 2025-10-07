import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({example: 'test@mail.com', description: 'Correo electrónico del usuario'})
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'supersecreto', description: 'Contraseña del usuario' })
  @IsNotEmpty()
  password: string;
}
