import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { GenerateGameUseCase } from '../../../core/application/game/generate-game.use-case';
import { SubmitGameUseCase } from '../../../core/application/game/submit-game.use-case';
import { GenerateGameDto, SubmitGameDto } from './dto/game.dto';
import { JwtAuthGuard } from '../../security/jwt-auth.guard';
import { CurrentUser } from '../../security/current-user.decorator';

@Controller('game')
@UseGuards(JwtAuthGuard)
export class GameController {
  constructor(
    private readonly generateGameUseCase: GenerateGameUseCase,
    private readonly submitGameUseCase: SubmitGameUseCase,
  ) {}

  @Post('generate')
  async generate(@Body() dto: GenerateGameDto) {
    return this.generateGameUseCase.execute(dto);
  }

  @Post('submit')
  async submit(@Body() dto: SubmitGameDto, @CurrentUser() user: { userId: string }) {
    return this.submitGameUseCase.execute({
      ...dto,
      userId: user.userId,
    });
  }
}
