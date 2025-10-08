import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto, LoginDto, RefreshTokenDto, LogoutDto } from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwt: JwtService
    ) { }

 /*    async register(registerDto: RegisterDto) {
        const hash = await bcrypt.hash(registerDto.password, 10);
        const user = await this.prismaService.user.create({
            data: { email: registerDto.email, password: hash },
        });

        return this.getTokens(user.id, user.email, user.role);
    } */

    async login(loginDto: LoginDto) {
        const user = await this.prismaService.user.findUnique({ where: { email: loginDto.email } });
        if (!user) throw new UnauthorizedException('Credenciales inválidas');

        const valid = await bcrypt.compare(loginDto.password, user.password);
        if (!valid) throw new UnauthorizedException('Credenciales inválidas');

        const tokens = await this.getTokens(user.id, user.email, user.role);
        const refreshTokenDto: RefreshTokenDto = { userId: user.id, refreshToken: tokens.refresh_token }
        await this.updateRefreshToken(refreshTokenDto);

        return tokens;
    }

    async refreshTokens(refreshTokenDto: RefreshTokenDto) {
        const user = await this.prismaService.user.findUnique({ where: { id: refreshTokenDto.userId } });
        if (!user || !user.refreshToken) throw new ForbiddenException();

        const valid = await bcrypt.compare(refreshTokenDto.refreshToken, user.refreshToken);
        if (!valid) throw new ForbiddenException();

        const tokens = await this.getTokens(user.id, user.email, user.role);

        const refreshToken: RefreshTokenDto = { userId: user.id, refreshToken: tokens.refresh_token }

        await this.updateRefreshToken(refreshToken);
        return tokens;
    }

    async logout(logoutDto: LogoutDto) {
        await this.prismaService.user.updateMany({
            where: { id: logoutDto.userId },
            data: { refreshToken: null },
        });
    }

    private async updateRefreshToken(refreshTokenDto: RefreshTokenDto) {
        const hash = await bcrypt.hash(refreshTokenDto.refreshToken, 10);
        await this.prismaService.user.update({
            where: { id: refreshTokenDto.userId },
            data: { refreshToken: hash },
        });
    }

    private async getTokens(userId: number, email: string, role: string) {
        const [at, rt] = await Promise.all([
            this.jwt.signAsync(
                { sub: userId, email, role },
                {
                    secret: process.env.JWT_ACCESS_SECRET,
                    expiresIn: process.env.JWT_ACCESS_EXPIRES,
                },
            ),
            this.jwt.signAsync(
                { sub: userId, email, role },
                {
                    secret: process.env.JWT_REFRESH_SECRET,
                    expiresIn: process.env.JWT_REFRESH_EXPIRES,
                },
            ),
        ]);
        return { access_token: at, refresh_token: rt };
    }

}
