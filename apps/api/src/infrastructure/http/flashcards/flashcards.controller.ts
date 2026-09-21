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
import { CreateFlashcardUseCase } from '../../../core/application/flashcards/create-flashcard.use-case';
import { GetFlashcardsUseCase } from '../../../core/application/flashcards/get-flashcards.use-case';
import { ModerateFlashcardUseCase } from '../../../core/application/flashcards/moderate-flashcard.use-case';
import { GetTaxonomiesUseCase } from '../../../core/application/flashcards/get-taxonomies.use-case';
import { SubmitStudySessionUseCase } from '../../../core/application/flashcards/submit-study-session.use-case';
import { SaveFlashcardUseCase } from '../../../core/application/flashcards/save-flashcard.use-case';
import { ReviewFlashcardUseCase } from '../../../core/application/flashcards/review-flashcard.use-case';
import { UpdateFlashcardUseCase } from '../../../core/application/flashcards/update-flashcard.use-case';
import { DeleteFlashcardUseCase } from '../../../core/application/flashcards/delete-flashcard.use-case';
import { CreateFlashcardDto } from './dto/create-flashcard.dto';
import { ModerateFlashcardDto } from './dto/moderate-flashcard.dto';
import { SubmitStudySessionDto } from './dto/study-session.dto';
import { ReviewDto } from './dto/review.dto';
import { JwtAuthGuard } from '../../security/jwt-auth.guard';
import { RolesGuard } from '../../security/roles.guard';
import { Roles } from '../../security/roles.decorator';
import { CurrentUser } from '../../security/current-user.decorator';
import { Role, WordStatus } from '@prisma/client';

/**
 * Inbound Adapter (HTTP Controller) para el módulo de Flashcards y Taxonomías.
 * Protegido globalmente con autenticación JWT mediante Cookie.
 *
 * @class FlashcardsController
 */
@Controller('flashcards')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FlashcardsController {
  constructor(
    private readonly createFlashcardUseCase: CreateFlashcardUseCase,
    private readonly getFlashcardsUseCase: GetFlashcardsUseCase,
    private readonly moderateFlashcardUseCase: ModerateFlashcardUseCase,
    private readonly getTaxonomiesUseCase: GetTaxonomiesUseCase,
    private readonly submitStudySessionUseCase: SubmitStudySessionUseCase,
    private readonly saveFlashcardUseCase: SaveFlashcardUseCase,
    private readonly reviewFlashcardUseCase: ReviewFlashcardUseCase,
    private readonly updateFlashcardUseCase: UpdateFlashcardUseCase,
    private readonly deleteFlashcardUseCase: DeleteFlashcardUseCase,
  ) {}

  /**
   * Obtiene el árbol completo de temas y categorías disponibles.
   *
   * @returns {Promise<any>} Árbol de taxonomías.
   */
  @Get('taxonomies')
  async getTaxonomies() {
    return this.getTaxonomiesUseCase.execute();
  }

  /**
   * Consulta las flashcards con filtros opcionales de tema, categoría y estado.
   *
   * @param {string} [topicId] ID del tema.
   * @param {string} [categoryId] ID de la categoría.
   * @param {WordStatus} [status] Estado de aprobación (por defecto APPROVED para usuarios).
   * @returns {Promise<any>} Lista de tarjetas.
   */
  @Get()
  async getFlashcards(
    @CurrentUser() user: { userId: string },
    @Query('groupId') groupId?: string,
    @Query('topicId') topicId?: string,
    @Query('categoryId') categoryId?: string,
    @Query('status') status?: WordStatus,
    @Query('onlyMyDeck') onlyMyDeck?: boolean,
    @Query('forStudy') forStudy?: boolean,
    @Query('search') search?: string,
  ) {
    return this.getFlashcardsUseCase.execute({
      groupId,
      topicId,
      categoryId,
      status,
      onlyMyDeck: onlyMyDeck === true || onlyMyDeck === ('true' as any),
      forStudy: forStudy === true || forStudy === ('true' as any),
      requesterId: user.userId,
      search,
    });
  }

  /**
   * Permite a cualquier usuario registrado sugerir o crear una flashcard.
   *
   * @param {CreateFlashcardDto} dto Datos de la tarjeta.
   * @param {any} user Usuario autenticado.
   * @returns {Promise<any>} Tarjeta creada.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createFlashcard(
    @Body() dto: CreateFlashcardDto,
    @CurrentUser() user: { userId: string; role: Role },
  ) {
    return this.createFlashcardUseCase.execute({
      ...dto,
      userId: user.userId,
      userRole: user.role,
    });
  }

  /**
   * Permite exclusivamente a un Administrador aprobar o rechazar una flashcard.
   *
   * @param {string} id ID de la flashcard.
   * @param {ModerateFlashcardDto} dto Estado deseado.
   * @param {any} admin Administrador autenticado.
   * @returns {Promise<any>} Tarjeta actualizada.
   */
  @Put(':id/moderate')
  @Roles(Role.ADMIN)
  async moderateFlashcard(
    @Param('id') id: string,
    @Body() dto: ModerateFlashcardDto,
    @CurrentUser() admin: { userId: string },
  ) {
    return this.moderateFlashcardUseCase.execute(id, dto.status, admin.userId);
  }

  /**
   * Registra los resultados de una sesión de estudio completada.
   *
   * @param {SubmitStudySessionDto} dto Métricas de la sesión.
   * @param {any} user Usuario autenticado.
   * @returns {Promise<any>} ID de la sesión registrada.
   */
  @Post('study-session')
  @HttpCode(HttpStatus.CREATED)
  async submitStudySession(
    @Body() dto: SubmitStudySessionDto,
    @CurrentUser() user: { userId: string },
  ) {
    return this.submitStudySessionUseCase.execute({
      ...dto,
      userId: user.userId,
    });
  }

  /**
   * Guarda o remueve una flashcard del mazo personal (favoritos).
   */
  @Post(':id/save')
  async toggleSave(@Param('id') flashcardId: string, @CurrentUser() user: { userId: string }) {
    return this.saveFlashcardUseCase.execute(flashcardId, user.userId);
  }

  /**
   * Registra el resultado del estudio de una tarjeta (SRS SM-2).
   */
  @Post(':id/review')
  @HttpCode(HttpStatus.OK)
  async reviewFlashcard(
    @Param('id') flashcardId: string,
    @Body() dto: ReviewDto,
    @CurrentUser() user: { userId: string },
  ) {
    return this.reviewFlashcardUseCase.execute(flashcardId, user.userId, dto.quality);
  }

  /**
   * Elimina una tarjeta privada propia.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteFlashcard(
    @Param('id') id: string,
    @CurrentUser() user: { userId: string; role?: string },
  ) {
    await this.deleteFlashcardUseCase.execute(id, user.userId, user.role);
  }

  /**
   * Edita una tarjeta privada propia.
   */
  @Patch(':id')
  async updateFlashcard(
    @Param('id') id: string,
    @Body() data: Partial<CreateFlashcardDto>,
    @CurrentUser() user: { userId: string; role?: string },
  ) {
    return this.updateFlashcardUseCase.execute(id, user.userId, data, user.role);
  }
}
