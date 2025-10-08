import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service'; // Necesario para buscar el usuario

// Define el tipo de Payload que se espera del token
type JwtPayload = {
    sub: number;
    email: string;
    role: 'USER' | 'ADMIN';
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private prismaService: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET!, // ¡Usar la misma clave que en auth.service.ts!
    });
  }

  async validate(payload: JwtPayload) {
    // 1. Opcional: buscar el usuario en la BD (para asegurar que sigue activo)
    const user = await this.prismaService.user.findUnique({ where: { id: payload.sub } });
    
    // 2. Si el usuario no existe o está bloqueado
    if (!user || !user.status) {
        throw new UnauthorizedException();
    }
    
    // 3. Devolvemos el payload. Esto se adjunta a req.user
    // ¡Aquí es donde 'role' llega a req.user!
    return payload; 
  }
}