import { Level, WordStatus } from '@prisma/client';

/**
 * Entidad de Dominio que representa una palabra o término de vocabulario en el sistema.
 *
 * @class Word
 */
export class Word {
  /**
   * Crea una nueva instancia de la entidad Word.
   *
   * @param {string} id - Identificador único universal de la palabra (UUID).
   * @param {string} englishWord - La palabra o frase en inglés.
   * @param {string} spanishTranslation - La traducción principal al español.
   * @param {Level} level - Nivel del Marco Común Europeo (A1 - C2).
   * @param {string} category - Categoría gramatical o temática (ej. adverbs, animals).
   * @param {string | null} exampleSentence - Oración de ejemplo en inglés.
   * @param {string | null} exampleTranslation - Traducción de la oración de ejemplo.
   * @param {WordStatus} status - Estado de aprobación (PENDING_APPROVAL, APPROVED, REJECTED).
   * @param {string | null} createdById - ID del usuario que sugirió la palabra.
   * @param {string | null} reviewedById - ID del administrador que aprobó o rechazó la palabra.
   * @param {Date} createdAt - Fecha en que la palabra fue creada.
   */
  constructor(
    public readonly id: string,
    public readonly englishWord: string,
    public readonly spanishTranslation: string,
    public readonly level: Level,
    public readonly category: string,
    public readonly exampleSentence: string | null,
    public readonly exampleTranslation: string | null,
    public readonly status: WordStatus,
    public readonly createdById: string | null,
    public readonly reviewedById: string | null,
    public readonly createdAt: Date,
    public readonly originalWordId?: string | null,
    public readonly originalWord?: Word | null,
    public readonly suggestionsCount?: number,
    public readonly isSaved?: boolean,
  ) {}
}
