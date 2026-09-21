import {
  IsNumber,
  IsOptional,
  IsEnum,
  IsString,
  IsArray,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Level } from '@prisma/client';

export class GenerateGameDto {
  @IsOptional()
  @IsEnum(Level)
  level?: Level;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @IsNumber()
  totalQuestions!: number;
}

export class GameAnswerDto {
  @IsString()
  wordId!: string;

  @IsBoolean()
  isCorrect!: boolean;

  @IsNumber()
  timeSpentMs!: number;

  @IsNumber()
  pointsEarned!: number;
}

export class SubmitGameDto {
  @IsOptional()
  @IsString()
  levelFilter?: string;

  @IsOptional()
  @IsString()
  categoryFilter?: string;

  @IsNumber()
  totalQuestions!: number;

  @IsNumber()
  score!: number;

  @IsNumber()
  correctCount!: number;

  @IsNumber()
  incorrectCount!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GameAnswerDto)
  answers!: GameAnswerDto[];
}
