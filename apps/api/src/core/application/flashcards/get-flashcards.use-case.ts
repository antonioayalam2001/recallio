import { Injectable, Inject } from '@nestjs/common';
import {
  IFlashcardRepository,
  FlashcardFilters,
} from '../../domain/repositories/flashcard.repository.interface';
import { FlashcardEntity } from '../../domain/entities/flashcard.entity';

/**
 * Caso de uso para consultar flashcards con filtros opcionales de Tema, Categoría y Estado.
 *
 * @class GetFlashcardsUseCase
 */
@Injectable()
export class GetFlashcardsUseCase {
  constructor(
    @Inject(IFlashcardRepository)
    private readonly flashcardRepository: IFlashcardRepository,
  ) {}

  /**
   * Ejecuta la búsqueda de flashcards.
   *
   * @param {FlashcardFilters} filters Filtros de búsqueda.
   * @returns {Promise<FlashcardEntity[]>} Lista de tarjetas encontradas.
   */
  async execute(filters?: FlashcardFilters): Promise<FlashcardEntity[]> {
    return this.flashcardRepository.findAll(filters);
  }
}
