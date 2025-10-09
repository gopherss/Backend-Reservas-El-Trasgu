import { ApiProperty } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, MinLength } from "class-validator";

export class CreateUserDto {
    @ApiProperty({ example: 'user@mail.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'supersecret', description: 'Min 6 chars' })
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ApiProperty({ example: 'USER', enum: ['USER', 'ADMIN', 'PORTERO'] })
    @IsOptional()
    @IsEnum(Role)
    role?: Role;
}
