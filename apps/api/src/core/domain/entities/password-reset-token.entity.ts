/**
 * Entidad de Dominio que representa un token de recuperación de contraseña.
 * Es agnóstica de frameworks o bases de datos.
 *
 * @class PasswordResetToken
 */
export class PasswordResetToken {
  /**
   * Crea una nueva instancia de la entidad PasswordResetToken.
   *
   * @param {string} id - Identificador único del token (UUID).
   * @param {string} userId - ID del usuario al que pertenece el token.
   * @param {string} token - Hash SHA-256 del token real enviado al usuario.
   * @param {Date} expiresAt - Fecha y hora de expiración del token.
   * @param {boolean} isUsed - Indica si el token ya fue utilizado.
   * @param {Date} createdAt - Fecha de creación del token.
   */
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly token: string,
    public readonly expiresAt: Date,
    public readonly isUsed: boolean,
    public readonly createdAt: Date,
  ) {}

  /**
   * Verifica si el token es válido (no expirado y no usado).
   *
   * @returns {boolean} True si el token es válido.
   */
  get isValid(): boolean {
    return !this.isUsed && new Date() < this.expiresAt;
  }
}
