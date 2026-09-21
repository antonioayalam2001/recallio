import React from 'react';
import { Sparkles } from 'lucide-react';

interface WordPoolStatusProps {
  totalAvailableWords: number;
  selectedCategoriesCount: number;
  levelFilter: string;
}

/**
 * Panel que muestra en tiempo real cuántas palabras hay disponibles
 * según la combinación de nivel y categorías seleccionadas.
 *
 * Extraído de GameArena.tsx (G5 del plan de refactorización).
 */
export const WordPoolStatus: React.FC<WordPoolStatusProps> = ({
  totalAvailableWords,
  selectedCategoriesCount,
  levelFilter,
}) => {
  return (
    <div className="bg-primary/5 border border-primary/15 rounded-2xl p-4 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <Sparkles className="w-5 h-5 text-primary flex-shrink-0" />
        <div>
          <p className="text-xs font-bold text-foreground/70">Palabras disponibles en la selección</p>
          <p className="text-xl font-black text-primary">{totalAvailableWords} palabras</p>
        </div>
      </div>
      <div className="text-right text-xs">
        <span className="font-bold text-foreground/80 block">
          {selectedCategoriesCount === 0
            ? 'Catálogo completo'
            : `${selectedCategoriesCount} categoría${selectedCategoriesCount > 1 ? 's' : ''}`}
        </span>
        <span className="text-[11px] text-muted-foreground">
          {levelFilter ? `Nivel ${levelFilter}` : 'Todos los niveles'}
        </span>
      </div>
    </div>
  );
};
