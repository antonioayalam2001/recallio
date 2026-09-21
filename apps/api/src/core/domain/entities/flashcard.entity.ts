import { WordStatus } from '@prisma/client';

/**
 * Entidad de dominio que representa una tarjeta de estudio interactiva (Flashcard).
 * Soporta anverso y reverso con sintaxis de Markdown y bloques de código.
 *
 * @class FlashcardEntity
 */
export class FlashcardEntity {
  constructor(
    public readonly id: string,
    public readonly front: string,
    public readonly back: string,
    public readonly groupId: string,
    public readonly topicId: string,
    public readonly categoryId: string,
    public readonly createdById: string,
    public status: WordStatus = WordStatus.PENDING_APPROVAL,
    public reviewedById?: string | null,
    public readonly groupName?: string,
    public readonly topicName?: string,
    public readonly categoryName?: string,
    public readonly createdByName?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly originalFlashcardId?: string | null,
    public readonly originalFlashcard?: FlashcardEntity | null,
  ) {}

  /**
   * Determina si la flashcard ha sido aprobada por un administrador.
   *
   * @returns {boolean} True si el estado es APPROVED.
   */
  public isApproved(): boolean {
    return this.status === WordStatus.APPROVED;
  }
}
