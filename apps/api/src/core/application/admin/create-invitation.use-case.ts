import { Injectable, Inject } from '@nestjs/common';
import { IInvitationRepository } from '../../domain/repositories/invitation.repository.interface';
import { InvitationStatus } from '@prisma/client';
import { randomBytes } from 'crypto';

@Injectable()
export class CreateInvitationUseCase {
  constructor(
    @Inject(IInvitationRepository) private readonly invitationRepository: IInvitationRepository,
  ) {}

  async execute(inviterId: string, email?: string, targetUserId?: string) {
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Expira en 7 días

    return this.invitationRepository.create({
      email: email || null,
      token,
      status: InvitationStatus.PENDING,
      inviterId,
      targetUserId: targetUserId || null,
      expiresAt,
    });
  }
}
