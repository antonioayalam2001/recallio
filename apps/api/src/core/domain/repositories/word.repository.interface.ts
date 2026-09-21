import { Word } from '../entities/word.entity';
import { Level, WordStatus } from '@prisma/client';

/**
 * Filtros opcionales para la búsqueda y paginación de palabras en el repositorio.
 */
export interface WordFilters {
  level?: Level;
  category?: string;
  categories?: string[];
  status?: WordStatus;
  search?: string;
  page?: number;
  limit?: number;
  requesterId?: string; // ID del usuario que solicita
  onlyMyDeck?: boolean; // Si es true, filtra solo creadas o guardadas por requesterId
  forStudy?: boolean;
}

/**
 * Envoltorio genérico para resultados paginados de base de datos.
 */
export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

/**
 * Puerto de Dominio (Interfaz) que define las operaciones
 * necesarias para interactuar con la persistencia de Palabras.
 *
 * @interface IWordRepository
 */
export interface IWordRepository {
  /**
   * Busca una palabra por su ID.
   *
   * @param {string} id - Identificador de la palabra.
   * @returns {Promise<Word | null>}
   */
  findById(id: string): Promise<Word | null>;

  /**
   * Obtiene una lista de palabras aplicando filtros opcionales (sin paginación obligatoria).
   *
   * @param {WordFilters} filters - Filtros por nivel, categoría o estado.
   * @returns {Promise<Word[]>}
   */
  findAll(filters?: WordFilters): Promise<Word[]>;

  /**
   * Obtiene una lista paginada de palabras con búsqueda insensible a mayúsculas/minúsculas.
   *
   * @param {WordFilters} filters - Filtros y parámetros de paginación.
   * @returns {Promise<PaginatedResult<Word>>}
   */
  findPaginated(filters?: WordFilters): Promise<PaginatedResult<Word>>;

  /**
   * Crea y persiste una nueva palabra en el repositorio.
   *
   * @param {Omit<Word, 'id' | 'createdAt'>} word - Datos de la palabra.
   * @returns {Promise<Word>}
   */
  create(word: Omit<Word, 'id' | 'createdAt'>): Promise<Word>;

  /**
   * Actualiza el estado de aprobación de una palabra y registra quién la revisó.
   *
   * @param {string} id - ID de la palabra a actualizar.
   * @param {WordStatus} status - Nuevo estado (APPROVED | REJECTED).
   * @param {string} adminId - ID del administrador que realizó la moderación.
   * @returns {Promise<Word>}
   */
  updateStatus(id: string, status: WordStatus, adminId: string): Promise<Word>;

  /**
   * Guarda o remueve una palabra de los favoritos del usuario.
   */
  toggleSave(wordId: string, userId: string): Promise<{ saved: boolean }>;

  review(wordId: string, userId: string, quality: number): Promise<void>;

  updateWord(id: string, data: Partial<Omit<Word, 'id' | 'createdAt'>>): Promise<Word>;

  deleteWord(id: string): Promise<void>;

  /**
   * Obtiene la lista de categorías existentes junto con su conteo de palabras.
   */
  getCategoriesWithCount(filters?: {
    level?: Level;
    status?: WordStatus;
  }): Promise<{ category: string; count: number }[]>;
}

export const IWordRepository = Symbol('IWordRepository');
