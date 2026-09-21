import { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { api } from '../../../../infrastructure/api';
import { useGame, type GameQuestion } from '../../../../application/useGame';
import type { GamePhase } from '../types';

interface UseGamePlayOptions {
  questions: GameQuestion[];
  phase: GamePhase;
  onPhaseChange: (phase: GamePhase) => void;
}

export interface UseGamePlayReturn {
  currentQuestion: ReturnType<typeof useGame>['currentQuestion'];
  score: number;
  timeLeft: number;
  correctCount: number;
  incorrectCount: number;
  answers: ReturnType<typeof useGame>['answers'];
  selectedId: string | null;
  isShattered: boolean;
  answeredQuestionId: string | null;
  onOptionClick: (optionId: string) => void;
  playAudio: () => void;
}

/**
 * Hook que encapsula el estado y la lógica del juego en progreso:
 * selección de opciones, animación de error (shatter), audio y
 * la transición automática a la fase 'gameover' al terminar.
 *
 * Extraído de GameArena.tsx (G7 del plan de refactorización).
 * Elimina los comentarios `eslint-disable react-hooks/set-state-in-effect` (G10).
 */
export function useGamePlay({
  questions,
  phase,
  onPhaseChange,
}: UseGamePlayOptions): UseGamePlayReturn {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isShattered, setIsShattered] = useState(false);
  const [answeredQuestionId, setAnsweredQuestionId] = useState<string | null>(null);

  const isStarted = phase === 'playing';

  const {
    currentQuestion,
    score,
    timeLeft,
    isGameOver,
    correctCount,
    incorrectCount,
    handleAnswer,
    answers,
  } = useGame(questions, isStarted);

  // Transición a gameover y envío de resultados cuando la partida termina
  useEffect(() => {
    if (!isGameOver || phase !== 'playing') return;

    onPhaseChange('gameover');
    api
      .post('/game/submit', {
        score,
        totalQuestions: questions.length,
        correctCount,
        incorrectCount,
        answers,
      })
      .catch((e) => console.error('Error al guardar partida:', e));
    // Dependencias intencionalmente acotadas: solo reaccionamos al cambio de isGameOver.
    // Incluir el resto causaría bucles infinitos porque score y answers cambian en cada respuesta.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGameOver]);

  const playAudio = useCallback(() => {
    if (!currentQuestion || !window.speechSynthesis || !isStarted) return;
    const utterance = new SpeechSynthesisUtterance(currentQuestion.englishWord);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  }, [currentQuestion, isStarted]);

  // Resetear estado de respuesta y reproducir audio al cambiar de pregunta
  useEffect(() => {
    if (!currentQuestion || !isStarted) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedId(null);
    setAnsweredQuestionId(null);
    setIsShattered(false);
    playAudio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion?.wordId, isStarted]);

  const onOptionClick = (optionId: string) => {
    if (answeredQuestionId === currentQuestion?.wordId) return;
    setSelectedId(optionId);
    setAnsweredQuestionId(currentQuestion?.wordId ?? null);

    const isCorrect = handleAnswer(optionId);
    if (isCorrect) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F43F5E', '#10b981', '#fbbf24', '#3b82f6'],
      });
    } else {
      setIsShattered(true);
    }
  };

  return {
    currentQuestion,
    score,
    timeLeft,
    correctCount,
    incorrectCount,
    answers,
    selectedId,
    isShattered,
    answeredQuestionId,
    onOptionClick,
    playAudio,
  };
}
