import { Module } from '@nestjs/common';
import { FlashcardsController } from '../infrastructure/http/flashcards/flashcards.controller';
import { CreateFlashcardUseCase } from '../core/application/flashcards/create-flashcard.use-case';
import { GetFlashcardsUseCase } from '../core/application/flashcards/get-flashcards.use-case';
import { ModerateFlashcardUseCase } from '../core/application/flashcards/moderate-flashcard.use-case';
import { GetTaxonomiesUseCase } from '../core/application/flashcards/get-taxonomies.use-case';
import { SubmitStudySessionUseCase } from '../core/application/flashcards/submit-study-session.use-case';
import { SaveFlashcardUseCase } from '../core/application/flashcards/save-flashcard.use-case';
import { ReviewFlashcardUseCase } from '../core/application/flashcards/review-flashcard.use-case';
import { UpdateFlashcardUseCase } from '../core/application/flashcards/update-flashcard.use-case';
import { DeleteFlashcardUseCase } from '../core/application/flashcards/delete-flashcard.use-case';
import { PrismaFlashcardRepository } from '../infrastructure/database/repositories/prisma-flashcard.repository';
import { IFlashcardRepository } from '../core/domain/repositories/flashcard.repository.interface';
import { PrismaService } from '../infrastructure/database/prisma.service';

/**
 * Módulo orquestador de Flashcards y Taxonomías en NestJS.
 * Conecta los casos de uso con el repositorio Prisma mediante Inversión de Dependencias.
 *
 * @class FlashcardsModule
 */
@Module({
  controllers: [FlashcardsController],
  providers: [
    PrismaService,
    {
      provide: IFlashcardRepository,
      useClass: PrismaFlashcardRepository,
    },
    CreateFlashcardUseCase,
    GetFlashcardsUseCase,
    ModerateFlashcardUseCase,
    GetTaxonomiesUseCase,
    SubmitStudySessionUseCase,
    SaveFlashcardUseCase,
    ReviewFlashcardUseCase,
    UpdateFlashcardUseCase,
    DeleteFlashcardUseCase,
  ],
  exports: [IFlashcardRepository],
})
export class FlashcardsModule {}
