import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ example: 1, description: 'ID del usuario' })
  @IsNumber()
  userId: number;

   @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Token de refresco válido',
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
