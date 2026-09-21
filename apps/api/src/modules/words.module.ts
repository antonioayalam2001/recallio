import { Module } from '@nestjs/common';
import { WordsController } from '../infrastructure/http/words/words.controller';
import { CreateWordUseCase } from '../core/application/words/create-word.use-case';
import { GetWordsUseCase } from '../core/application/words/get-words.use-case';
import { ModerateWordUseCase } from '../core/application/words/moderate-word.use-case';
import { SaveWordUseCase } from '../core/application/words/save-word.use-case';
import { ReviewWordUseCase } from '../core/application/words/review-word.use-case';
import { UpdateWordUseCase } from '../core/application/words/update-word.use-case';
import { DeleteWordUseCase } from '../core/application/words/delete-word.use-case';
import { GetWordCategoriesUseCase } from '../core/application/words/get-word-categories.use-case';
import { PrismaWordRepository } from '../infrastructure/database/repositories/prisma-word.repository';
import { IWordRepository } from '../core/domain/repositories/word.repository.interface';
import { PrismaService } from '../infrastructure/database/prisma.service';

/**
 * Ensamblaje Hexagonal para el módulo de palabras (WordsModule).
 */
@Module({
  controllers: [WordsController],
  providers: [
    PrismaService,
    {
      provide: IWordRepository,
      useClass: PrismaWordRepository,
    },
    CreateWordUseCase,
    GetWordsUseCase,
    GetWordCategoriesUseCase,
    ModerateWordUseCase,
    SaveWordUseCase,
    ReviewWordUseCase,
    UpdateWordUseCase,
    DeleteWordUseCase,
  ],
  exports: [IWordRepository],
})
export class WordsModule {}
