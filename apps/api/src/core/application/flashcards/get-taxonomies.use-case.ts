import { Injectable, Inject } from '@nestjs/common';
import {
  IFlashcardRepository,
  GroupWithTopics,
} from '../../domain/repositories/flashcard.repository.interface';

/**
 * Caso de Uso para obtener la jerarquía completa de taxonomías.
 */
@Injectable()
export class GetTaxonomiesUseCase {
  constructor(
    @Inject(IFlashcardRepository)
    private readonly flashcardRepository: IFlashcardRepository,
  ) {}

  /**
   * Obtiene la lista de Grupos con sus Temas y Categorías.
   */
  async execute(): Promise<GroupWithTopics[]> {
    return this.flashcardRepository.getTaxonomiesTree();
  }
}
