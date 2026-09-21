import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { IWordRepository } from '../../domain/repositories/word.repository.interface';
import { Level, WordStatus } from '@prisma/client';

export interface GenerateGameInput {
  level?: Level;
  category?: string;
  categories?: string[];
  totalQuestions: number;
}

export interface GameQuestionPayload {
  wordId: string;
  englishWord: string;
  level: string;
  category: string;
  options: { id: string; spanishTranslation: string }[];
}

@Injectable()
export class GenerateGameUseCase {
  constructor(@Inject(IWordRepository) private readonly wordRepository: IWordRepository) {}

  /**
   * Shuffles an array in place (Fisher-Yates).
   */
  private shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  /**
   * Genera una lista de preguntas con distractores dinámicos.
   */
  async execute(input: GenerateGameInput): Promise<GameQuestionPayload[]> {
    // 1. Obtener todas las palabras aprobadas filtradas
    const allWords = await this.wordRepository.findAll({
      level: input.level,
      category: input.category,
      categories: input.categories,
      status: WordStatus.APPROVED,
    });

    if (allWords.length < input.totalQuestions) {
      throw new BadRequestException(
        'No hay suficientes palabras en el sistema para esa configuración',
      );
    }

    // 2. Barajar y tomar N palabras objetivo
    const shuffledWords = this.shuffleArray([...allWords]);
    const targetWords = shuffledWords.slice(0, input.totalQuestions);

    // 3. Generar preguntas y distractores
    const questions: GameQuestionPayload[] = targetWords.map((target) => {
      // Elegir 3 distractores aleatorios que NO sean la palabra objetivo
      const potentialDistractors = allWords.filter((w) => w.id !== target.id);
      const randomDistractors = this.shuffleArray(potentialDistractors).slice(0, 3);

      const options = [
        { id: target.id, spanishTranslation: target.spanishTranslation },
        ...randomDistractors.map((d) => ({ id: d.id, spanishTranslation: d.spanishTranslation })),
      ];

      return {
        wordId: target.id,
        englishWord: target.englishWord,
        level: target.level,
        category: target.category,
        options: this.shuffleArray(options), // Barajar para que la correcta no esté siempre primera
      };
    });

    return questions;
  }
}
