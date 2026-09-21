export class GameSession {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly levelFilter: string | null,
    public readonly categoryFilter: string | null,
    public readonly totalQuestions: number,
    public readonly score: number,
    public readonly correctCount: number,
    public readonly incorrectCount: number,
    public readonly createdAt: Date,
  ) {}
}

export class GameAnswer {
  constructor(
    public readonly id: string,
    public readonly gameSessionId: string,
    public readonly wordId: string,
    public readonly isCorrect: boolean,
    public readonly timeSpentMs: number,
    public readonly pointsEarned: number,
  ) {}
}
