import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UserResponseDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'admin@example.com' })
    user: string;

    @ApiProperty({ enum: Role, example: Role.ADMIN })
    role: Role;

    @ApiProperty({ example: true })
    status: boolean;

    @ApiProperty({ example: '2025-10-13T21:54:58.990Z' })
    createdAt: Date;

    @ApiProperty({ example: '2025-10-13T21:54:58.990Z' })
    updatedAt: Date;
}