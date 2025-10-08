import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';


export class SetRoleDto {
  @ApiProperty({ example: 'ADMIN', enum: ['USER','ADMIN'] })
  @IsEnum(Role)
  @IsNotEmpty()
  role: 'USER' | 'ADMIN';
}
