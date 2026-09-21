/**
 * Interfaz de carga útil para el token de autenticación.
 */
export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

/**
 * Puerto de Dominio para la gestión de tokens (generalmente JWT).
 *
 * @interface ITokenService
 */
export interface ITokenService {
  /**
   * Genera un token firmado para el usuario.
   *
   * @param {TokenPayload} payload - Información que será encriptada y firmada en el token.
   * @returns {Promise<string>} El token de autenticación generado.
   */
  generateToken(payload: TokenPayload): Promise<string>;

  /**
   * Verifica y decodifica un token existente.
   *
   * @param {string} token - El token a verificar.
   * @returns {Promise<TokenPayload>} El payload desencriptado y validado.
   * @throws {Error} Si el token es inválido o expiró.
   */
  verifyToken(token: string): Promise<TokenPayload>;
}

export const ITokenService = Symbol('ITokenService');
