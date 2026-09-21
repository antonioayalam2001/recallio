import { PasswordResetToken } from '../entities/password-reset-token.entity';

/**
 * Puerto de Dominio (Interfaz) que define las operaciones
 * necesarias para gestionar tokens de recuperación de contraseña.
 *
 * @interface IPasswordResetTokenRepository
 */
export interface IPasswordResetTokenRepository {
  /**
   * Crea y persiste un nuevo token de recuperación de contraseña.
   *
   * @param {string} userId - ID del usuario al que pertenece el token.
   * @param {string} hashedToken - Hash del token a guardar.
   * @param {Date} expiresAt - Fecha de expiración del token.
   * @returns {Promise<PasswordResetToken>} El token recién creado.
   */
  create(userId: string, hashedToken: string, expiresAt: Date): Promise<PasswordResetToken>;

  /**
   * Busca un token de recuperación por su hash.
   *
   * @param {string} hashedToken - Hash del token a buscar.
   * @returns {Promise<PasswordResetToken | null>} El token si es hallado y válido.
   */
  findByToken(hashedToken: string): Promise<PasswordResetToken | null>;

  /**
   * Marca un token como utilizado (invalidándolo para uso futuro).
   *
   * @param {string} id - Identificador del token a invalidar.
   * @returns {Promise<void>}
   */
  markAsUsed(id: string): Promise<void>;

  /**
   * Invalida todos los tokens pendientes de un usuario (para cuando hace un nuevo reset).
   *
   * @param {string} userId - Identificador del usuario.
   * @returns {Promise<void>}
   */
  invalidateAllForUser(userId: string): Promise<void>;
}

export const IPasswordResetTokenRepository = Symbol('IPasswordResetTokenRepository');
