import React from 'react';
import { LEVEL_OPTIONS, type LanguageLevel } from '../../constants/levels';

interface LevelSelectorProps {
  levelFilter: string;
  onLevelChange: (level: string) => void;
}

/**
 * Selector de nivel de dificultad del juego.
 * Muestra botones para "Todos" y cada nivel MCER (A1–C2).
 *
 * Extraído de GameArena.tsx (G2 del plan de refactorización).
 */
export const LevelSelector: React.FC<LevelSelectorProps> = ({ levelFilter, onLevelChange }) => {
  const btnBase = 'py-2 px-3 rounded-xl font-bold text-xs transition-all';
  const btnActive = 'bg-primary text-white shadow-md shadow-primary/20 scale-105';
  const btnInactive = 'bg-background border border-border hover:border-primary/40 text-foreground/70';

  return (
    <div>
      <label className="text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 block">
        Nivel de dificultad
      </label>
      <div className="grid grid-cols-3 sm:grid-cols-7 gap-1.5">
        <button
          onClick={() => onLevelChange('')}
          className={`${btnBase} ${levelFilter === '' ? btnActive : btnInactive}`}
        >
          Todos
        </button>
        {LEVEL_OPTIONS.map((l: LanguageLevel) => (
          <button
            key={l}
            onClick={() => onLevelChange(l)}
            className={`${btnBase} ${levelFilter === l ? btnActive : btnInactive}`}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  );
};
