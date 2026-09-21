import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { IPasswordHasher } from '../../core/domain/services/password-hasher.interface';

/**
 * Adaptador concreto para IPasswordHasher utilizando la librería Bcrypt.
 * Cumple con el contrato del dominio sin acoplar el dominio a esta librería específica.
 *
 * @class BcryptPasswordHasher
 * @implements {IPasswordHasher}
 */
@Injectable()
export class BcryptPasswordHasher implements IPasswordHasher {
  /**
   * Salting rounds (factor de costo).
   * 10 es un buen balance entre seguridad y rendimiento para aplicaciones modernas.
   */
  private readonly saltRounds = 10;

  /**
   * Encripta una contraseña en texto plano utilizando bcrypt.
   *
   * @param {string} plainText - Contraseña sin encriptar.
   * @returns {Promise<string>} Hash de bcrypt generado.
   */
  async hash(plainText: string): Promise<string> {
    return bcrypt.hash(plainText, this.saltRounds);
  }

  /**
   * Verifica que la contraseña coincida con el hash proporcionado.
   *
   * @param {string} plainText - Contraseña a verificar.
   * @param {string} hash - Hash guardado en base de datos.
   * @returns {Promise<boolean>} True si son iguales.
   */
  async compare(plainText: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainText, hash);
  }
}
