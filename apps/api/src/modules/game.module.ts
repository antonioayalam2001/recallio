import { Module } from '@nestjs/common';
import { GameController } from '../infrastructure/http/game/game.controller';
import { GenerateGameUseCase } from '../core/application/game/generate-game.use-case';
import { SubmitGameUseCase } from '../core/application/game/submit-game.use-case';
import { PrismaGameRepository } from '../infrastructure/database/repositories/prisma-game.repository';
import { IGameRepository } from '../core/domain/repositories/game.repository.interface';
import { WordsModule } from './words.module';
import { PrismaService } from '../infrastructure/database/prisma.service';

@Module({
  imports: [WordsModule],
  controllers: [GameController],
  providers: [
    PrismaService,
    {
      provide: IGameRepository,
      useClass: PrismaGameRepository,
    },
    GenerateGameUseCase,
    SubmitGameUseCase,
  ],
})
export class GameModule {}
