import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { IInvitationRepository } from '../../domain/repositories/invitation.repository.interface';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { IPasswordHasher } from '../../domain/services/password-hasher.interface';
import { InvitationStatus, Role } from '@prisma/client';
import { PrismaService } from '../../../infrastructure/database/prisma.service';

@Injectable()
export class AcceptInvitationUseCase {
  constructor(
    @Inject(IInvitationRepository) private readonly invitationRepository: IInvitationRepository,
    @Inject(IUserRepository) private readonly userRepository: IUserRepository,
    @Inject(IPasswordHasher) private readonly passwordHasher: IPasswordHasher,
    private readonly prisma: PrismaService, // Needed to update role easily or we can add updateRole to IUserRepository
  ) {}

  async execute(token: string, name?: string, password?: string) {
    const invitation = await this.invitationRepository.findByToken(token);
    if (!invitation) throw new NotFoundException('Invitación no encontrada');
    if (invitation.status !== InvitationStatus.PENDING)
      throw new BadRequestException('Invitación inválida o ya usada');
    if (invitation.expiresAt < new Date()) throw new BadRequestException('Invitación expirada');

    if (invitation.targetUserId) {
      // Ascender usuario existente
      await this.prisma.user.update({
        where: { id: invitation.targetUserId },
        data: { role: Role.ADMIN },
      });
    } else {
      // Crear nuevo usuario admin
      if (!name || !password || !invitation.email)
        throw new BadRequestException('Faltan datos para crear la cuenta');

      const existing = await this.userRepository.findByEmail(invitation.email);
      if (existing) throw new BadRequestException('El correo ya está registrado');

      const hashedPassword = await this.passwordHasher.hash(password);

      const nameParts = name.split(' ');
      const firstName = nameParts[0] || 'Admin';
      const lastName = nameParts.length > 1 ? nameParts[1] : '';
      const motherLastName = nameParts.length > 2 ? nameParts.slice(2).join(' ') : '';
      const nickname = invitation.email.split('@')[0] + '_' + Math.floor(Math.random() * 1000);

      await this.userRepository.create({
        email: invitation.email.toLowerCase(),
        firstName,
        lastName,
        motherLastName,
        name,
        nickname: nickname.toLowerCase(),
        passwordHash: hashedPassword,
        role: Role.ADMIN,
        avatarUrl: null,
      });
    }

    await this.invitationRepository.updateStatus(invitation.id, InvitationStatus.ACCEPTED);
    return { success: true };
  }
}
