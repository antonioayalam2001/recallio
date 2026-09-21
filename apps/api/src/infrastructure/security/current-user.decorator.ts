import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorador de parámetro que extrae el payload del usuario autenticado
 * directamente de la request (inyectado previamente por JwtAuthGuard).
 */
export const CurrentUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user; // Devuelve el { userId, email, role }
});
