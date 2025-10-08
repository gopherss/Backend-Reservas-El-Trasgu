import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [
    JwtModule.register({}),
    PassportModule
  ],
  providers: [AuthService, JwtStrategy, PrismaService],
  controllers: [AuthController],
})
export class AuthModule { }
