import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { IPasswordResetTokenRepository } from '../../domain/repositories/password-reset-token.repository.interface';
import { IPasswordHasher } from '../../domain/services/password-hasher.interface';
import { ResetPasswordDto } from '../../../infrastructure/http/auth/dto/reset-password.dto';

/**
 * Caso de Uso que maneja el restablecimiento de contraseña mediante token.
 * Verifica la validez del token, actualiza el hash de la contraseña y lo invalida.
 *
 * @class ResetPasswordUseCase
 */
@Injectable()
export class ResetPasswordUseCase {
  constructor(
    @Inject(IUserRepository) private readonly userRepository: IUserRepository,
    @Inject(IPasswordResetTokenRepository)
    private readonly resetTokenRepository: IPasswordResetTokenRepository,
    @Inject(IPasswordHasher) private readonly passwordHasher: IPasswordHasher,
  ) {}

  /**
   * Verifica el token, actualiza la contraseña y lo marca como usado.
   *
   * @param {ResetPasswordDto} dto - Token y nueva contraseña.
   * @returns {Promise<{ message: string }>} Mensaje de éxito.
   * @throws {BadRequestException} Si el token es inválido, expirado o ya fue usado.
   */
  async execute(dto: ResetPasswordDto): Promise<{ message: string }> {
    // Hashear el token recibido del usuario para compararlo con el de la BD
    const hashedToken = crypto.createHash('sha256').update(dto.token).digest('hex');

    const resetToken = await this.resetTokenRepository.findByToken(hashedToken);

    if (!resetToken || !resetToken.isValid) {
      throw new BadRequestException('El token de recuperación es inválido o ha expirado');
    }

    const newPasswordHash = await this.passwordHasher.hash(dto.newPassword);

    await this.userRepository.update(resetToken.userId, { passwordHash: newPasswordHash });

    // Invalidar el token para que no pueda ser reutilizado
    await this.resetTokenRepository.markAsUsed(resetToken.id);

    return { message: 'Contraseña restablecida correctamente' };
  }
}
