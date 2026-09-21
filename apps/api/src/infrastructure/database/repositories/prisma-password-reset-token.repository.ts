import { Injectable } from '@nestjs/common';
import type { PasswordResetToken as PrismaPasswordResetToken } from '@prisma/client';
import { IPasswordResetTokenRepository } from '../../../core/domain/repositories/password-reset-token.repository.interface';
import { PasswordResetToken } from '../../../core/domain/entities/password-reset-token.entity';
import { PrismaService } from '../prisma.service';

/**
 * Implementación concreta de IPasswordResetTokenRepository usando Prisma ORM.
 *
 * @class PrismaPasswordResetTokenRepository
 * @implements {IPasswordResetTokenRepository}
 */
@Injectable()
export class PrismaPasswordResetTokenRepository implements IPasswordResetTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToDomain(model: PrismaPasswordResetToken): PasswordResetToken {
    return new PasswordResetToken(
      model.id,
      model.userId,
      model.token,
      model.expiresAt,
      model.isUsed,
      model.createdAt,
    );
  }

  async create(userId: string, hashedToken: string, expiresAt: Date): Promise<PasswordResetToken> {
    const token = await this.prisma.passwordResetToken.create({
      data: {
        userId,
        token: hashedToken,
        expiresAt,
      },
    });
    return this.mapToDomain(token);
  }

  async findByToken(hashedToken: string): Promise<PasswordResetToken | null> {
    const token = await this.prisma.passwordResetToken.findUnique({
      where: { token: hashedToken },
    });
    if (!token) return null;
    return this.mapToDomain(token);
  }

  async markAsUsed(id: string): Promise<void> {
    await this.prisma.passwordResetToken.update({
      where: { id },
      data: { isUsed: true },
    });
  }

  async invalidateAllForUser(userId: string): Promise<void> {
    await this.prisma.passwordResetToken.updateMany({
      where: { userId, isUsed: false },
      data: { isUsed: true },
    });
  }
}
