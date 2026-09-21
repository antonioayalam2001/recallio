/**
 * Constantes de niveles de idioma compartidas en toda la aplicación.
 * Evita la duplicación entre VocabularyView, GameArena, EditWordModal y otros.
 */

/** Niveles del Marco Común Europeo de Referencia (MCER) */
export const LEVEL_OPTIONS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;

export type LanguageLevel = (typeof LEVEL_OPTIONS)[number];

/**
 * Clases Tailwind para representar visualmente cada nivel con color de fondo,
 * texto y borde. Se aplican a badges de nivel en tarjetas de vocabulario.
 */
export const LEVEL_COLORS: Record<string, string> = {
  A1: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  A2: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
  B1: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  B2: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
  C1: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  C2: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
};

/**
 * Retorna las clases de color para un nivel dado.
 * Incluye un fallback si el nivel no se reconoce.
 */
export function getLevelColorClass(level: string): string {
  // eslint-disable-next-line security/detect-object-injection
  return LEVEL_COLORS[level] ?? 'bg-primary/10 text-primary border-primary/20';
}
