/**
 * Puerto de Dominio para el encriptado y verificación de contraseñas.
 * Permite inyectar distintas estrategias (ej. Bcrypt, Argon2) sin acoplar el core.
 *
 * @interface IPasswordHasher
 */
export interface IPasswordHasher {
  /**
   * Encripta una contraseña en texto plano utilizando un algoritmo seguro.
   *
   * @param {string} plainText - La contraseña original sin encriptar.
   * @returns {Promise<string>} El hash generado de la contraseña.
   */
  hash(plainText: string): Promise<string>;

  /**
   * Verifica si una contraseña en texto plano coincide con el hash guardado.
   *
   * @param {string} plainText - Contraseña a verificar.
   * @param {string} hash - Hash contra el que se validará.
   * @returns {Promise<boolean>} True si coinciden, False en caso contrario.
   */
  compare(plainText: string, hash: string): Promise<boolean>;
}

export const IPasswordHasher = Symbol('IPasswordHasher');
