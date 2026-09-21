import { AdminModule } from './modules/admin.module';
import { GameModule } from './modules/game.module';
import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth.module';
import { WordsModule } from './modules/words.module';
import { FlashcardsModule } from './modules/flashcards.module';

/**
 * Módulo principal de la aplicación NestJS (Root Module).
 * Importa los submódulos orquestadores del sistema.
 *
 * @class AppModule
 */
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    AuthModule,
    WordsModule,
    GameModule,
    AdminModule,
    FlashcardsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
