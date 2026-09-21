import React from 'react';
import { Loader2, Check, Sparkles } from 'lucide-react';
import type { CategoryCount } from './types';

interface CategorySelectorProps {
  availableCategories: CategoryCount[];
  selectedCategories: string[];
  isLoadingCategories: boolean;
  onToggleCategory: (catName: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
}

/**
 * Selector multi-categoría del lobby del juego.
 * Muestra etiquetas tipo pill con conteo de palabras, spinner de carga
 * y botones de acción para seleccionar/limpiar todas.
 *
 * Extraído de GameArena.tsx (G3 del plan de refactorización).
 */
export const CategorySelector: React.FC<CategorySelectorProps> = ({
  availableCategories,
  selectedCategories,
  isLoadingCategories,
  onToggleCategory,
  onSelectAll,
  onClearAll,
}) => {
  const totalWords = availableCategories.reduce((acc, c) => acc + c.count, 0);

  return (
    <div>
      {/* Header: label + contador + acciones */}
      <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-foreground/70 uppercase tracking-wider">
            Categorías
          </label>
          <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-primary/10 text-primary border border-primary/20">
            {selectedCategories.length === 0
              ? 'Todas activas'
              : `${selectedCategories.length} seleccionada${selectedCategories.length > 1 ? 's' : ''}`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {selectedCategories.length > 0 ? (
            <button
              onClick={onClearAll}
              className="text-xs font-bold text-primary hover:underline transition-colors"
            >
              Restablecer a todas
            </button>
          ) : (
            availableCategories.length > 1 && (
              <button
                onClick={onSelectAll}
                className="text-xs font-medium text-foreground/60 hover:text-primary transition-colors"
              >
                Seleccionar individualmente
              </button>
            )
          )}
        </div>
      </div>

      {/* Content */}
      {isLoadingCategories ? (
        <div className="flex items-center gap-2 py-4 justify-center text-xs opacity-60">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          Cargando categorías...
        </div>
      ) : availableCategories.length === 0 ? (
        <div className="text-xs text-muted-foreground p-4 bg-background rounded-xl border border-border text-center">
          No hay palabras registradas para este nivel.
        </div>
      ) : (
        <div className="flex flex-wrap gap-2 max-h-52 overflow-y-auto p-1 pr-2">
          {/* Botón "Todas las categorías" */}
          <button
            onClick={onClearAll}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
              selectedCategories.length === 0
                ? 'bg-primary text-white border-primary shadow-sm scale-105'
                : 'bg-background hover:bg-foreground/5 text-foreground/80 border-border hover:border-primary/30'
            }`}
          >
            {selectedCategories.length === 0 && <Check className="w-3 h-3 stroke-[3]" />}
            <Sparkles className="w-3 h-3 opacity-80" />
            <span>Todas las categorías</span>
            <span
              className={`text-[10px] px-1.5 rounded-full ${
                selectedCategories.length === 0
                  ? 'bg-white/20 text-white'
                  : 'bg-foreground/10 text-foreground/60'
              }`}
            >
              {totalWords}
            </span>
          </button>

          {/* Etiquetas individuales */}
          {availableCategories.map((c) => {
            const isSelected = selectedCategories.includes(c.category);
            return (
              <button
                key={c.category}
                onClick={() => onToggleCategory(c.category)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                  isSelected
                    ? 'bg-primary text-white border-primary shadow-sm scale-105'
                    : 'bg-background hover:bg-foreground/5 text-foreground/80 border-border hover:border-primary/30'
                }`}
              >
                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                <span>{c.category}</span>
                <span
                  className={`text-[10px] px-1.5 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-foreground/10 text-foreground/60'
                  }`}
                >
                  {c.count}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
