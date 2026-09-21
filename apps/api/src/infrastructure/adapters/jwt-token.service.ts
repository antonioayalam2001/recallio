import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ITokenService, TokenPayload } from '../../core/domain/services/token.service.interface';

/**
 * Adaptador concreto para ITokenService utilizando la integración oficial de NestJS con JSON Web Tokens.
 *
 * @class JwtTokenService
 * @implements {ITokenService}
 */
@Injectable()
export class JwtTokenService implements ITokenService {
  /**
   * @param {JwtService} jwtService - Servicio nativo de NestJS para manipular JWTs.
   */
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Genera un token JWT asíncronamente con un payload provisto por la capa de aplicación.
   *
   * @param {TokenPayload} payload - Información sobre el usuario para incluir en el token.
   * @returns {Promise<string>} Token JWT firmado.
   */
  async generateToken(payload: TokenPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  /**
   * Verifica la autenticidad y vigencia de un JWT.
   *
   * @param {string} token - Token recibido en la cabecera.
   * @returns {Promise<TokenPayload>} Objeto decodificado del token.
   * @throws {UnauthorizedException} Si la validación del token falla.
   */
  async verifyToken(token: string): Promise<TokenPayload> {
    try {
      return await this.jwtService.verifyAsync<TokenPayload>(token);
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
