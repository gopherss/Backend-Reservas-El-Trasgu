import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsBoolean } from 'class-validator';

export class BlockUserDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  userId: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  block: boolean;
}
