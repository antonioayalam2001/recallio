import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { IPasswordHasher } from '../../domain/services/password-hasher.interface';
import { ITokenService } from '../../domain/services/token.service.interface';
import { LoginDto } from '../../../infrastructure/http/auth/dto/login.dto';

/**
 * Caso de Uso que maneja el inicio de sesión de un usuario.
 *
 * @class LoginUseCase
 */
@Injectable()
export class LoginUseCase {
  /**
   * Inyecta los puertos definidos en el dominio.
   *
   * @param {IUserRepository} userRepository - Repositorio para buscar el usuario.
   * @param {IPasswordHasher} passwordHasher - Servicio para verificar el hash de la contraseña.
   * @param {ITokenService} tokenService - Servicio para emitir el JWT de autenticación.
   */
  constructor(
    @Inject(IUserRepository) private readonly userRepository: IUserRepository,
    @Inject(IPasswordHasher) private readonly passwordHasher: IPasswordHasher,
    @Inject(ITokenService) private readonly tokenService: ITokenService,
  ) {}

  /**
   * Ejecuta el inicio de sesión: valida credenciales y devuelve un token.
   *
   * @param {LoginDto} dto - Datos de entrada provistos por el controlador HTTP.
   * @returns {Promise<{ accessToken: string }>} Objeto que contiene el token JWT generado.
   * @throws {UnauthorizedException} Si el correo no existe o la contraseña es incorrecta.
   */
  async execute(dto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await this.passwordHasher.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const token = await this.tokenService.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return { accessToken: token };
  }
}
