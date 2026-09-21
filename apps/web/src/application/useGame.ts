import { useState, useCallback, useEffect } from 'react';

/**
 * Interface representing a Game Question.
 */
export interface GameQuestion {
  wordId: string;
  englishWord: string;
  level: string;
  category: string;
  options: { id: string; spanishTranslation: string }[];
}

/**
 * Interface representing an Answer given by the user.
 */
export interface AnswerRecord {
  wordId: string;
  isCorrect: boolean;
  timeSpentMs: number;
  pointsEarned: number;
}

/**
 * Hook de Aplicación (Clean Architecture) que maneja la lógica de estado del juego.
 * Extrae la complejidad de puntuación, turnos y temporizadores fuera de la UI.
 */
export function useGame(questions: GameQuestion[], isStarted: boolean = true) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);

  // eslint-disable-next-line security/detect-object-injection
  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    if (isGameOver || !currentQuestion || !isStarted) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTimeLeft(15);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleAnswer(null); // Timeout (treated as incorrect)
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, isGameOver, currentQuestion, handleAnswer, isStarted]);

  const handleAnswer = useCallback(
    (selectedOptionId: string | null) => {
      if (isGameOver) return false;

      const isCorrect = selectedOptionId === currentQuestion.wordId;
      const timeSpentMs = (15 - timeLeft) * 1000;

      let points = 0;
      if (isCorrect) {
        points = 10 + Math.floor(timeLeft / 2); // Base 10 + Speed bonus (max 7)
        setScore((s) => s + points);
        setCorrectCount((c) => c + 1);
      } else {
        points = -5;
        setScore((s) => s + points);
        setIncorrectCount((c) => c + 1);
      }

      setAnswers((prev) => [
        ...prev,
        { wordId: currentQuestion.wordId, isCorrect, timeSpentMs, pointsEarned: points },
      ]);

      // Next question delay
      setTimeout(() => {
        if (currentIndex + 1 >= questions.length) {
          setIsGameOver(true);
        } else {
          setCurrentIndex((i) => i + 1);
        }
      }, 1200);

      return isCorrect;
    },
    [currentQuestion, currentIndex, questions.length, timeLeft, isGameOver],
  );

  return {
    currentQuestion,
    currentIndex,
    totalQuestions: questions.length,
    score,
    timeLeft,
    isGameOver,
    correctCount,
    incorrectCount,
    handleAnswer,
    answers,
  };
}
