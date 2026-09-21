import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { IFlashcardRepository } from '../../domain/repositories/flashcard.repository.interface';
import { FlashcardEntity } from '../../domain/entities/flashcard.entity';
import { WordStatus } from '@prisma/client';

export interface CreateFlashcardInput {
  front: string;
  back: string;
  groupName: string;
  topicName: string;
  categoryName: string;
  userId: string;
  userRole?: string;
  isPrivate?: boolean;
  originalFlashcardId?: string;
}

/**
 * Caso de Uso para crear una nueva Flashcard de estudio.
 * Si el Grupo, Tema o la Categoría no existen previamente, los crea dinámicamente en el repositorio.
 * Si el creador es ADMIN, se aprueba automáticamente; si es USER, queda en PENDING_APPROVAL.
 * Si isPrivate es true, se guarda como PRIVATE (sin importar el rol).
 * Si originalFlashcardId está presente, SIEMPRE queda en PENDING_APPROVAL (es una sugerencia de cambio).
 *
 * @class CreateFlashcardUseCase
 */
@Injectable()
export class CreateFlashcardUseCase {
  constructor(
    @Inject(IFlashcardRepository)
    private readonly flashcardRepository: IFlashcardRepository,
  ) {}

  /**
   * Ejecuta la creación de la Flashcard y resolución de taxonomías.
   *
   * @param {CreateFlashcardInput} input Datos de entrada de la tarjeta.
   * @returns {Promise<FlashcardEntity>} La tarjeta creada.
   */
  async execute(input: CreateFlashcardInput): Promise<FlashcardEntity> {
    const trimmedFront = input.front?.trim();
    const trimmedBack = input.back?.trim();
    const trimmedGroup = input.groupName?.trim();
    const trimmedTopic = input.topicName?.trim();
    const trimmedCategory = input.categoryName?.trim();

    if (!trimmedFront || !trimmedBack) {
      throw new BadRequestException('El anverso y el reverso de la flashcard son obligatorios');
    }
    if (!trimmedGroup || !trimmedTopic || !trimmedCategory) {
      throw new BadRequestException('El grupo, tema y categoría son obligatorios');
    }

    // 1. Obtener o crear dinámicamente el Grupo
    const group = await this.flashcardRepository.findOrCreateGroup(trimmedGroup);

    // 2. Obtener o crear dinámicamente el Tema
    const topic = await this.flashcardRepository.findOrCreateTopic(group.id, trimmedTopic);

    // 3. Obtener o crear dinámicamente la Categoría dentro de ese Tema
    const category = await this.flashcardRepository.findOrCreateCategory(topic.id, trimmedCategory);

    // 4. Definir estado inicial
    let initialStatus: WordStatus =
      input.userRole === 'ADMIN' ? WordStatus.APPROVED : WordStatus.PENDING_APPROVAL;
    if (input.isPrivate) {
      initialStatus = WordStatus.PRIVATE;
    }
    // Si es una sugerencia de cambio de una tarjeta pública, SIEMPRE pasa a PENDING_APPROVAL para moderación
    if (input.originalFlashcardId) {
      initialStatus = WordStatus.PENDING_APPROVAL;
    }

    // 5. Crear la Flashcard
    return this.flashcardRepository.createFlashcard({
      front: trimmedFront,
      back: trimmedBack,
      groupId: group.id,
      topicId: topic.id,
      categoryId: category.id,
      createdById: input.userId,
      status: initialStatus,
      originalFlashcardId: input.originalFlashcardId,
    });
  }
}
