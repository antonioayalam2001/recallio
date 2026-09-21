/**
 * Tipos compartidos del módulo game/.
 * Centralizados aquí para evitar redefiniciones entre GameArena,
 * hooks de lobby/play y componentes de UI del juego.
 */

/** Fases del flujo de juego */
export type GamePhase = 'lobby' | 'loading' | 'playing' | 'gameover';

/** Categoría con el conteo de palabras disponibles */
export interface CategoryCount {
  category: string;
  count: number;
}

/** Opción del selector de cantidad de preguntas (adaptativo) */
export interface QuestionOption {
  value: number;
  label: string;
  /** True cuando representa el total completo de palabras disponibles */
  isAll: boolean;
}
