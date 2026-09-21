import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreateWordUseCase } from '../../../core/application/words/create-word.use-case';
import { GetWordsUseCase } from '../../../core/application/words/get-words.use-case';
import { ModerateWordUseCase } from '../../../core/application/words/moderate-word.use-case';
import { SaveWordUseCase } from '../../../core/application/words/save-word.use-case';
import { ReviewWordUseCase } from '../../../core/application/words/review-word.use-case';
import { UpdateWordUseCase } from '../../../core/application/words/update-word.use-case';
import { DeleteWordUseCase } from '../../../core/application/words/delete-word.use-case';
import { GetWordCategoriesUseCase } from '../../../core/application/words/get-word-categories.use-case';
import { CreateWordDto } from './dto/create-word.dto';
import { ModerateWordDto } from './dto/moderate-word.dto';
import { GetWordsQueryDto } from './dto/get-words-query.dto';
import { ReviewDto } from '../flashcards/dto/review.dto';
import { JwtAuthGuard } from '../../security/jwt-auth.guard';
import { RolesGuard } from '../../security/roles.guard';
import { Roles } from '../../security/roles.decorator';
import { CurrentUser } from '../../security/current-user.decorator';
import { Role, Level } from '@prisma/client';

/**
 * Inbound Adapter para gestionar las peticiones HTTP del módulo Words.
 * Requiere autenticación JWT para todos sus endpoints.
 */
@Controller('words')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WordsController {
  constructor(
    private readonly createWordUseCase: CreateWordUseCase,
    private readonly getWordsUseCase: GetWordsUseCase,
    private readonly getWordCategoriesUseCase: GetWordCategoriesUseCase,
    private readonly moderateWordUseCase: ModerateWordUseCase,
    private readonly saveWordUseCase: SaveWordUseCase,
    private readonly reviewWordUseCase: ReviewWordUseCase,
    private readonly updateWordUseCase: UpdateWordUseCase,
    private readonly deleteWordUseCase: DeleteWordUseCase,
  ) {}

  /**
   * Obtiene la lista de categorías existentes con su conteo de palabras.
   */
  @Get('categories')
  async getCategories(@Query('level') level?: Level) {
    return this.getWordCategoriesUseCase.execute({ level });
  }

  /**
   * Obtiene la lista de palabras, soportando filtrado por nivel, categoría, estado,
   * búsqueda en texto y paginación con metadatos.
   */
  @Get()
  async getWords(@Query() query: GetWordsQueryDto, @CurrentUser() user: { userId: string }) {
    return this.getWordsUseCase.execute({
      ...query,
      requesterId: user.userId,
    });
  }

  /**
   * Endpoint para que cualquier usuario envíe una nueva palabra.
   * La palabra quedará automáticamente PENDING_APPROVAL.
   */
  @Post()
  async createWord(
    @Body() dto: CreateWordDto,
    @CurrentUser() user: { userId: string; role: string },
  ) {
    return this.createWordUseCase.execute(dto, user.userId, user.role);
  }

  /**
   * Moderación de palabra: ÚNICAMENTE los administradores pueden cambiar
   * el status (Aprobar o Rechazar).
   */
  @Put(':id/moderate')
  @Roles(Role.ADMIN)
  async moderateWord(
    @Param('id') wordId: string,
    @Body() dto: ModerateWordDto,
    @CurrentUser() admin: { userId: string },
  ) {
    return this.moderateWordUseCase.execute(wordId, dto.status, admin.userId);
  }

  /**
   * Guarda o remueve una palabra del mazo personal (favoritos).
   */
  @Post(':id/save')
  async toggleSave(@Param('id') wordId: string, @CurrentUser() user: { userId: string }) {
    return this.saveWordUseCase.execute(wordId, user.userId);
  }

  /**
   * Registra el resultado del estudio de una palabra (SRS SM-2).
   */
  @Post(':id/review')
  @HttpCode(HttpStatus.OK)
  async reviewWord(
    @Param('id') wordId: string,
    @Body() dto: ReviewDto,
    @CurrentUser() user: { userId: string },
  ) {
    return this.reviewWordUseCase.execute(wordId, user.userId, dto.quality);
  }

  /**
   * Elimina una palabra privada propia.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteWord(
    @Param('id') id: string,
    @CurrentUser() user: { userId: string; role?: string },
  ) {
    await this.deleteWordUseCase.execute(id, user.userId, user.role);
  }

  /**
   * Edita una palabra privada propia.
   */
  @Patch(':id')
  async updateWord(
    @Param('id') id: string,
    @Body() data: Partial<CreateWordDto>,
    @CurrentUser() user: { userId: string; role?: string },
  ) {
    return this.updateWordUseCase.execute(id, user.userId, data, user.role);
  }
}
