import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import * as crypto from 'crypto';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { IPasswordResetTokenRepository } from '../../domain/repositories/password-reset-token.repository.interface';

/**
 * Caso de Uso que maneja la solicitud de recuperación de contraseña.
 * Genera un token seguro, lo hashea y lo persiste en BD.
 * NOTA: El envío real de email está pendiente de integración SMTP/SendGrid.
 * Por ahora el token y link se imprimen en consola para desarrollo.
 *
 * @class ForgotPasswordUseCase
 */
@Injectable()
export class ForgotPasswordUseCase {
  // El token expira en 30 minutos
  private readonly TOKEN_EXPIRY_MINUTES = 30;

  constructor(
    @Inject(IUserRepository) private readonly userRepository: IUserRepository,
    @Inject(IPasswordResetTokenRepository)
    private readonly resetTokenRepository: IPasswordResetTokenRepository,
  ) {}

  /**
   * Genera un token de recuperación y lo simula enviando por email (console.log).
   * No revela si el email existe o no (prevención de enumeración de usuarios).
   *
   * @param {string} email - Correo del usuario que solicita el reset.
   * @returns {Promise<{ message: string }>} Mensaje genérico de éxito.
   */
  async execute(email: string): Promise<{ message: string }> {
    const genericMessage = { message: 'Si el correo existe, recibirás instrucciones en breve.' };

    const user = await this.userRepository.findByEmail(email.toLowerCase());
    if (!user) {
      // Retornamos el mismo mensaje para no revelar si el email existe
      return genericMessage;
    }

    // Invalidar tokens anteriores del usuario
    await this.resetTokenRepository.invalidateAllForUser(user.id);

    // Generar token criptográficamente seguro (32 bytes = 64 hex chars)
    const rawToken = crypto.randomBytes(32).toString('hex');

    // Hashear el token con SHA-256 para guardarlo en BD
    // (el token raw solo existe en memoria y se "envía" al usuario)
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    const expiresAt = new Date(Date.now() + this.TOKEN_EXPIRY_MINUTES * 60 * 1000);

    await this.resetTokenRepository.create(user.id, hashedToken, expiresAt);

    // TODO: Reemplazar este console.log por un servicio real de email (SendGrid/Nodemailer)
    const resetLink = `http://localhost:4321/reset-password?token=${rawToken}`;
    console.log('\n🔐 [DEV - EMAIL SIMULADO] ========================');
    console.log(`Para: ${user.email}`);
    console.log(`Asunto: Recuperación de contraseña`);
    console.log(`Link de reset (expira en ${this.TOKEN_EXPIRY_MINUTES} min):`);
    console.log(`  ${resetLink}`);
    console.log('================================================\n');

    return genericMessage;
  }
}
