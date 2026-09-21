import { InvitationStatus } from '@prisma/client';

export class AdminInvitation {
  constructor(
    public readonly id: string,
    public readonly email: string | null,
    public readonly token: string,
    public readonly status: InvitationStatus,
    public readonly inviterId: string,
    public readonly targetUserId: string | null,
    public readonly expiresAt: Date,
    public readonly createdAt: Date,
  ) {}
}
