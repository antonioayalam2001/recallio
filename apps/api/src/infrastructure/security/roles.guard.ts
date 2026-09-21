import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from './roles.decorator';

/**
 * Guard de NestJS que intercepta la petición, extrae el usuario inyectado
 * por JwtAuthGuard y valida si su rol figura entre los roles permitidos
 * para acceder al endpoint (usando el decorador @Roles).
 *
 * @class RolesGuard
 * @implements {CanActivate}
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si la ruta no tiene decorador @Roles, se permite acceso libre
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    // Si no hay usuario en la request (JwtAuthGuard no pasó), bloqueamos
    if (!user) {
      throw new ForbiddenException('Acceso denegado. No se encontró el contexto del usuario.');
    }

    const hasRole = requiredRoles.some((role) => user.role === role);
    if (!hasRole) {
      throw new ForbiddenException('Acceso denegado. Rol insuficiente.');
    }

    return true;
  }
}
