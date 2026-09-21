import { api } from '../api';
import type { IAdminRepository } from '../../domain/repositories/IAdminRepository';
import type { Word } from '../../domain/models/vocabulary';
import type { Flashcard } from '../../domain/models/flashcard';

export class AdminRepository implements IAdminRepository {
  async getPendingWords(): Promise<Word[]> {
    const response = await api.get('/words?status=PENDING_APPROVAL');
    return Array.isArray(response.data) ? response.data : response.data?.data || [];
  }

  async getPendingFlashcards(): Promise<Flashcard[]> {
    const response = await api.get('/flashcards?status=PENDING_APPROVAL');
    return Array.isArray(response.data) ? response.data : response.data?.data || [];
  }

  async moderateWord(id: string, status: 'APPROVED' | 'REJECTED'): Promise<void> {
    await api.put(`/words/${id}/moderate`, { status });
  }

  async moderateFlashcard(id: string, status: 'APPROVED' | 'REJECTED'): Promise<void> {
    await api.put(`/flashcards/${id}/moderate`, { status });
  }

  async generateInvite(email: string): Promise<{ token: string }> {
    const response = await api.post<{ token: string }>('/admin/invitations', { email });
    return response.data;
  }
}

export const adminRepository = new AdminRepository();
