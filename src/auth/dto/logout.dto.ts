import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class LogoutDto {
  @ApiProperty({ example: 1, description: 'ID del usuario que cierra sesión' })
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
