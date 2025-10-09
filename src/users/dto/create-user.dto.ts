import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsOptional, MinLength } from "class-validator";

export class CreateUserDto {
    @ApiProperty({ example: 'user_trasgu', description: 'Min 2 caracteres' })
    @IsNotEmpty()
    @MinLength(2)
    user: string;

    @ApiProperty({ example: 'supersecret', description: 'Min 6 caracteres' })
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ApiProperty({ example: 'USER', enum: ['USER', 'ADMIN', 'PORTRESS'] })
    @IsOptional()
    @IsEnum(Role)
    role?: Role;
}
