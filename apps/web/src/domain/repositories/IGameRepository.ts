import type { GameQuestion } from '../../application/useGame';

export interface IGameRepository {
  generateMatch(totalQuestions?: number): Promise<GameQuestion[]>;
  submitMatch(data: Record<string, unknown>): Promise<void>;
}
