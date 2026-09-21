import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { WordCard } from './WordCard';
import { ShatteredWordCard } from './ShatteredWordCard';
import type { GameQuestion } from '../../../application/useGame';

interface GameBoardProps {
  currentQuestion: GameQuestion;
  timeLeft: number;
  score: number;
  answersCount: number;
  questionsCount: number;
  isShattered: boolean;
  selectedId: string | null;
  answeredQuestionId: string | null;
  onOptionClick: (optionId: string) => void;
  onPlayAudio: () => void;
}

/**
 * Vista de la fase de juego activo (playing).
 * Muestra la barra de puntuación/progreso, la WordCard o ShatteredWordCard,
 * el botón de audio y el grid de opciones de respuesta.
 *
 * Extraído de GameArena.tsx (G8 del plan de refactorización).
 */
export const GameBoard: React.FC<GameBoardProps> = ({
  currentQuestion,
  timeLeft,
  score,
  answersCount,
  questionsCount,
  isShattered,
  selectedId,
  answeredQuestionId,
  onOptionClick,
  onPlayAudio,
}) => {
  const isAnswered = answeredQuestionId === currentQuestion.wordId;

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto relative">
      {/* Score & progress bar */}
      <div className="w-full flex justify-between items-center mb-8 px-4">
        <div className="text-2xl font-black text-primary">Score: {score}</div>
        <div className="text-sm font-semibold text-foreground/50">
          {answersCount + 1} / {questionsCount}
        </div>
      </div>

      {/* Word card */}
      <div className="w-full relative z-10">
        {isShattered ? (
          <ShatteredWordCard question={currentQuestion} timeLeft={timeLeft} />
        ) : (
          <WordCard question={currentQuestion} timeLeft={timeLeft} />
        )}
      </div>

      {/* Audio button */}
      <button
        onClick={onPlayAudio}
        className="mt-6 mb-8 bg-background shadow p-4 rounded-full text-foreground hover:text-primary transition-colors border border-primary/10 relative z-10"
        title="Escuchar pronunciación"
        aria-label="Escuchar pronunciación"
      >
        <Volume2 className="w-8 h-8" />
      </button>

      {/* Answer options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl px-4 relative z-10">
        <AnimatePresence mode="popLayout">
          {currentQuestion.options.map((opt) => {
            const isSelected = selectedId === opt.id;
            const isCorrect = currentQuestion.wordId === opt.id;

            let bgClass = 'bg-card hover:bg-primary/10';
            if (isAnswered) {
              if (isCorrect) bgClass = 'bg-success text-white scale-105 shadow-md border-transparent';
              else if (isSelected) bgClass = 'bg-error text-white scale-95 shadow-inner border-transparent';
              else bgClass = 'bg-card opacity-50';
            }

            return (
              <motion.button
                key={opt.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                disabled={isAnswered}
                onClick={() => onOptionClick(opt.id)}
                className={`p-6 rounded-2xl text-xl font-bold border-2 border-primary/20 transition-all duration-300 shadow-sm ${bgClass}`}
              >
                {opt.spanishTranslation}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
