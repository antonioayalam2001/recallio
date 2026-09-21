import { Injectable } from '@nestjs/common';
import { IInvitationRepository } from '../../../core/domain/repositories/invitation.repository.interface';
import { AdminInvitation } from '../../../core/domain/entities/admin-invitation.entity';
import { PrismaService } from '../prisma.service';
import { InvitationStatus } from '@prisma/client';

@Injectable()
export class PrismaInvitationRepository implements IInvitationRepository {
  constructor(private readonly prisma: PrismaService) {}

  private map(prismaInv: any): AdminInvitation {
    return new AdminInvitation(
      prismaInv.id,
      prismaInv.email,
      prismaInv.token,
      prismaInv.status,
      prismaInv.inviterId,
      prismaInv.targetUserId,
      prismaInv.expiresAt,
      prismaInv.createdAt,
    );
  }

  async create(data: Omit<AdminInvitation, 'id' | 'createdAt'>): Promise<AdminInvitation> {
    const created = await this.prisma.adminInvitation.create({
      data: {
        email: data.email,
        token: data.token,
        status: data.status,
        inviterId: data.inviterId,
        targetUserId: data.targetUserId,
        expiresAt: data.expiresAt,
      },
    });
    return this.map(created);
  }

  async findByToken(token: string): Promise<AdminInvitation | null> {
    const inv = await this.prisma.adminInvitation.findUnique({ where: { token } });
    return inv ? this.map(inv) : null;
  }

  async updateStatus(id: string, status: InvitationStatus): Promise<AdminInvitation> {
    const updated = await this.prisma.adminInvitation.update({
      where: { id },
      data: { status },
    });
    return this.map(updated);
  }

  async findAll(): Promise<AdminInvitation[]> {
    const list = await this.prisma.adminInvitation.findMany({ orderBy: { createdAt: 'desc' } });
    return list.map(this.map);
  }
}
