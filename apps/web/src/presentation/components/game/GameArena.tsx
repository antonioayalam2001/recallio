import React, { useState } from 'react';
import { type GameQuestion } from '../../../application/useGame';
import { MatchSummary } from './MatchSummary';
import { GameLobby } from './GameLobby';
import { GameBoard } from './GameBoard';
import { GameLoadingScreen } from './GameLoadingScreen';
import { useGameLobby } from './hooks/useGameLobby';
import { useGamePlay } from './hooks/useGamePlay';
import type { GamePhase } from './types';

/**
 * Componente orquestador del flujo de juego.
 * Gestiona únicamente la fase activa y delega todo el estado/lógica
 * a `useGameLobby` y `useGamePlay`.
 *
 * Fases: lobby → loading → playing → gameover
 */
export const GameArena: React.FC = () => {
  const [phase, setPhase] = useState<GamePhase>('lobby');
  const [questions, setQuestions] = useState<GameQuestion[]>([]);

  // ──────────────────────────────────────────────
  // Lobby state & logic
  // ──────────────────────────────────────────────
  const lobbyProps = useGameLobby({
    onPhaseChange: setPhase,
    onQuestionsLoaded: setQuestions,
  });

  // ──────────────────────────────────────────────
  // Game play state & logic
  // ──────────────────────────────────────────────
  const {
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
  } = useGamePlay({ questions, phase, onPhaseChange: setPhase });

  // ──────────────────────────────────────────────
  // Phase router
  // ──────────────────────────────────────────────
  return (
    <div className="min-h-screen">
      {phase === 'lobby' && <GameLobby {...lobbyProps} />}

      {phase === 'loading' && <GameLoadingScreen />}

      {phase === 'playing' && currentQuestion && (
        <GameBoard
          currentQuestion={currentQuestion}
          timeLeft={timeLeft}
          score={score}
          answersCount={answers.length}
          questionsCount={questions.length}
          isShattered={isShattered}
          selectedId={selectedId}
          answeredQuestionId={answeredQuestionId}
          onOptionClick={onOptionClick}
          onPlayAudio={playAudio}
        />
      )}

      {phase === 'gameover' && (
        <MatchSummary
          score={score}
          correctCount={correctCount}
          incorrectCount={incorrectCount}
          answers={answers}
          questions={questions}
          onRestart={() => {
            setPhase('lobby');
            setQuestions([]);
          }}
        />
      )}
    </div>
  );
};
