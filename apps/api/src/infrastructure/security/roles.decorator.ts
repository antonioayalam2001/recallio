import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

export const ROLES_KEY = 'roles';

/**
 * Decorador para establecer los roles permitidos en un controlador o ruta.
 *
 * @param {...Role[]} roles - Lista de roles (ej. Role.ADMIN, Role.USER).
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
