import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';


export class SetRoleDto {
  @ApiProperty({ example: 'ADMIN', enum: ['USER','ADMIN'] })
  @IsEnum(['USER','ADMIN'] as any)
  @IsNotEmpty()
  role: 'USER' | 'ADMIN';
}
