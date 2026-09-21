import { Injectable } from '@nestjs/common';
import { IGameRepository } from '../../../core/domain/repositories/game.repository.interface';
import { GameSession } from '../../../core/domain/entities/game-session.entity';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaGameRepository implements IGameRepository {
  constructor(private readonly prisma: PrismaService) {}

  async saveSession(
    session: Omit<GameSession, 'id' | 'createdAt'>,
    answers: any[],
  ): Promise<GameSession> {
    const created = await this.prisma.gameSession.create({
      data: {
        userId: session.userId,
        levelFilter: session.levelFilter,
        categoryFilter: session.categoryFilter,
        totalQuestions: session.totalQuestions,
        score: session.score,
        correctCount: session.correctCount,
        incorrectCount: session.incorrectCount,
        answers: {
          create: answers.map((a) => ({
            wordId: a.wordId,
            isCorrect: a.isCorrect,
            timeSpentMs: a.timeSpentMs,
            pointsEarned: a.pointsEarned,
          })),
        },
      },
    });

    return new GameSession(
      created.id,
      created.userId,
      created.levelFilter,
      created.categoryFilter,
      created.totalQuestions,
      created.score,
      created.correctCount,
      created.incorrectCount,
      created.createdAt,
    );
  }

  async getUserHistory(userId: string): Promise<GameSession[]> {
    const sessions = await this.prisma.gameSession.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return sessions.map(
      (s) =>
        new GameSession(
          s.id,
          s.userId,
          s.levelFilter,
          s.categoryFilter,
          s.totalQuestions,
          s.score,
          s.correctCount,
          s.incorrectCount,
          s.createdAt,
        ),
    );
  }
}
