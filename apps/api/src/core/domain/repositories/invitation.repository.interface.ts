import { AdminInvitation } from '../entities/admin-invitation.entity';

export interface IInvitationRepository {
  create(invitation: Omit<AdminInvitation, 'id' | 'createdAt'>): Promise<AdminInvitation>;
  findByToken(token: string): Promise<AdminInvitation | null>;
  updateStatus(id: string, status: any): Promise<AdminInvitation>;
  findAll(): Promise<AdminInvitation[]>;
}

export const IInvitationRepository = Symbol('IInvitationRepository');
