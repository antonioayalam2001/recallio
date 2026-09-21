import { GameSession } from '../entities/game-session.entity';

export interface IGameRepository {
  /**
   * Guarda una sesión de juego completada junto con sus respuestas asociadas.
   */
  saveSession(session: Omit<GameSession, 'id' | 'createdAt'>, answers: any[]): Promise<GameSession>;

  /**
   * Recupera el historial de partidas de un usuario.
   */
  getUserHistory(userId: string): Promise<GameSession[]>;
}

export const IGameRepository = Symbol('IGameRepository');
