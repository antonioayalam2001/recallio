import { Injectable, Inject } from '@nestjs/common';
import { IGameRepository } from '../../domain/repositories/game.repository.interface';
import { GameSession } from '../../domain/entities/game-session.entity';

export interface SubmitGameInput {
  userId: string;
  levelFilter?: string;
  categoryFilter?: string;
  totalQuestions: number;
  score: number;
  correctCount: number;
  incorrectCount: number;
  answers: {
    wordId: string;
    isCorrect: boolean;
    timeSpentMs: number;
    pointsEarned: number;
  }[];
}

@Injectable()
export class SubmitGameUseCase {
  constructor(@Inject(IGameRepository) private readonly gameRepository: IGameRepository) {}

  async execute(input: SubmitGameInput): Promise<GameSession> {
    return this.gameRepository.saveSession(
      {
        userId: input.userId,
        levelFilter: input.levelFilter || null,
        categoryFilter: input.categoryFilter || null,
        totalQuestions: input.totalQuestions,
        score: input.score,
        correctCount: input.correctCount,
        incorrectCount: input.incorrectCount,
      },
      input.answers,
    );
  }
}
