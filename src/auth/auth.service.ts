import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto, LogoutDto, RefreshTokenDto } from './dto';

@Injectable()
export class AuthService {

    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwt: JwtService
    ) { }

    async login(loginDto: LoginDto) {
        const userExits = await this.prismaService.user.findUnique({ where: { user: loginDto.user } });
        if (!userExits) throw new UnauthorizedException('Credenciales inválidas');
        if (!userExits.status) throw new UnauthorizedException('El usuario no está activo');

        const valid = await bcrypt.compare(loginDto.password, userExits.password);
        if (!valid) throw new UnauthorizedException('Credenciales inválidas');

        const tokens = await this.getTokens(userExits.id, userExits.user, userExits.role);
        const refreshTokenDto: RefreshTokenDto = { userId: userExits.id, refreshToken: tokens.refresh_token }
        await this.updateRefreshToken(refreshTokenDto);

        return tokens;
    }

    async refreshTokens(refreshTokenDto: RefreshTokenDto) {
        const userExits = await this.prismaService.user.findUnique({ where: { id: refreshTokenDto.userId } });
        if (!userExits || !userExits.refreshToken) throw new ForbiddenException();

        const valid = await bcrypt.compare(refreshTokenDto.refreshToken, userExits.refreshToken);
        if (!valid) throw new ForbiddenException();

        const tokens = await this.getTokens(userExits.id, userExits.user, userExits.role);

        const refreshToken: RefreshTokenDto = { userId: userExits.id, refreshToken: tokens.refresh_token }

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

    private async getTokens(userId: number, user: string, role: string) {
        const [at, rt] = await Promise.all([
            this.jwt.signAsync(
                { sub: userId, user, role },
                {
                    secret: process.env.JWT_ACCESS_SECRET,
                    expiresIn: process.env.JWT_ACCESS_EXPIRES,
                },
            ),
            this.jwt.signAsync(
                { sub: userId, user, role },
                {
                    secret: process.env.JWT_REFRESH_SECRET,
                    expiresIn: process.env.JWT_REFRESH_EXPIRES,
                },
            ),
        ]);
        return { access_token: at, refresh_token: rt };
    }

}
