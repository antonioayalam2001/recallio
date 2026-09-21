import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, Library, AlertCircle } from 'lucide-react';
import { LevelSelector } from './LevelSelector';
import { CategorySelector } from './CategorySelector';
import { QuestionCountSelector } from './QuestionCountSelector';
import { WordPoolStatus } from './WordPoolStatus';
import type { UseGameLobbyReturn } from './hooks/useGameLobby';

type GameLobbyProps = UseGameLobbyReturn;

/**
 * Vista completa del lobby del juego.
 * Orquesta los subcomponentes de configuración (nivel, categorías,
 * cantidad de preguntas y pool de palabras) y el botón de inicio.
 *
 * Extraído de GameArena.tsx (G6 del plan de refactorización).
 */
export const GameLobby: React.FC<GameLobbyProps> = ({
  levelFilter,
  setLevelFilter,
  selectedCategories,
  availableCategories,
  isLoadingCategories,
  totalAvailableWords,
  questionOptions,
  totalQuestions,
  setSelectedQuestions,
  canStart,
  toggleCategory,
  selectAllCategories,
  selectAllOrClear,
  startGame,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-8">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="bg-card p-6 md:p-10 rounded-3xl shadow-2xl border border-primary/10 max-w-2xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <PlayCircle className="w-9 h-9 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-1">Configurar Partida</h2>
          <p className="text-sm text-muted-foreground">Personaliza las categorías y nivel antes de jugar</p>
        </div>

        {/* Config sections */}
        <div className="space-y-6 mb-8">
          <LevelSelector levelFilter={levelFilter} onLevelChange={setLevelFilter} />

          <CategorySelector
            availableCategories={availableCategories}
            selectedCategories={selectedCategories}
            isLoadingCategories={isLoadingCategories}
            onToggleCategory={toggleCategory}
            onSelectAll={selectAllCategories}
            onClearAll={selectAllOrClear}
          />

          <WordPoolStatus
            totalAvailableWords={totalAvailableWords}
            selectedCategoriesCount={selectedCategories.length}
            levelFilter={levelFilter}
          />

          <QuestionCountSelector
            totalAvailableWords={totalAvailableWords}
            totalQuestions={totalQuestions}
            questionOptions={questionOptions}
            onSelectCount={setSelectedQuestions}
          />
        </div>

        {/* Warning when insufficient words */}
        {totalAvailableWords < 4 && (
          <div className="mb-6 p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-2.5 text-xs text-amber-600 dark:text-amber-400 font-semibold">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>
              {totalAvailableWords === 0
                ? 'No hay palabras registradas para esta selección. Elige otras categorías o cambia de nivel.'
                : `Se requieren al menos 4 palabras para iniciar (actualmente hay ${totalAvailableWords}). Agrega más categorías o cambia de nivel.`}
            </span>
          </div>
        )}

        {/* Start button */}
        <button
          onClick={startGame}
          disabled={!canStart}
          className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-black text-lg transition-all ${
            canStart
              ? 'bg-primary text-white shadow-[0_4px_24px_rgba(244,63,94,0.4)] hover:scale-[1.02] cursor-pointer'
              : 'bg-foreground/10 text-foreground/40 cursor-not-allowed'
          }`}
        >
          <PlayCircle className="w-6 h-6" />
          {totalAvailableWords < 4
            ? 'Palabras insuficientes para jugar'
            : `Comenzar Partida (${totalQuestions} preguntas)`}
        </button>

        <a
          href="/vocabulary"
          className="mt-4 w-full text-center text-xs text-foreground/50 hover:text-primary transition-colors flex items-center justify-center gap-1.5 py-1"
        >
          <Library className="w-3.5 h-3.5" /> Explorar catálogo de palabras
        </a>
      </motion.div>
    </div>
  );
};
