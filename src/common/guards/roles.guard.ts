import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Obtener los roles requeridos del metadato de la ruta
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si no se especifica ningún rol, el acceso es libre (aunque el JwtAuthGuard lo protegería)
    if (!requiredRoles) {
      return true;
    }
    
    // 2. Extraer el objeto 'user' de la solicitud.
    // **IMPORTANTE**: Asumimos que un JwtAuthGuard ya se ejecutó y adjuntó el usuario (con el rol) al request.
    const { user } = context.switchToHttp().getRequest();
    
    // Si no hay usuario, o el usuario no tiene rol (esto no debería pasar si el JwtAuthGuard funciona)
    if (!user || !user.role) {
        throw new ForbiddenException('Acceso denegado. Rol de usuario no definido.');
    }

    // 3. Comprobar si el rol del usuario está incluido en los roles requeridos
    const hasRequiredRole = requiredRoles.some((role) => user.role === role);

    if (!hasRequiredRole) {
        throw new ForbiddenException('Acceso denegado. Requiere rol ' + requiredRoles.join(' o '));
    }
    
    return true;
  }
}