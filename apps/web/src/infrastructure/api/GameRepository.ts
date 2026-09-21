import { api } from '../api';
import type { GameQuestion } from '../../application/useGame';
import type { IGameRepository } from '../../domain/repositories/IGameRepository';

export class GameRepository implements IGameRepository {
  async generateMatch(totalQuestions: number = 10): Promise<GameQuestion[]> {
    const response = await api.post<GameQuestion[]>('/game/generate', { totalQuestions });
    return response.data;
  }

  async submitMatch(data: Record<string, unknown>): Promise<void> {
    await api.post('/game/submit', data);
  }
}

export const gameRepository = new GameRepository();
