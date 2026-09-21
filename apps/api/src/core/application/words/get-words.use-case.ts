import { Injectable, Inject } from '@nestjs/common';
import {
  IWordRepository,
  WordFilters,
  PaginatedResult,
} from '../../domain/repositories/word.repository.interface';
import { Word } from '../../domain/entities/word.entity';

/**
 * Caso de uso para obtener palabras de la base de datos.
 * Soporta resultados paginados con metadatos si se especifica página, límite o búsqueda.
 *
 * @class GetWordsUseCase
 */
@Injectable()
export class GetWordsUseCase {
  constructor(@Inject(IWordRepository) private readonly wordRepository: IWordRepository) {}

  /**
   * Obtiene la lista de palabras aplicando filtros y paginación opcional.
   *
   * @param {WordFilters} [filters] Filtros de búsqueda y parámetros de paginación.
   * @returns {Promise<Word[] | PaginatedResult<Word>>}
   */
  async execute(filters?: WordFilters): Promise<Word[] | PaginatedResult<Word>> {
    if (
      filters?.page !== undefined ||
      filters?.limit !== undefined ||
      filters?.search !== undefined
    ) {
      return this.wordRepository.findPaginated(filters);
    }
    return this.wordRepository.findAll(filters);
  }
}
