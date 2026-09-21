import React from 'react';
import { Settings2 } from 'lucide-react';
import type { QuestionOption } from './types';

interface QuestionCountSelectorProps {
  totalAvailableWords: number;
  totalQuestions: number;
  questionOptions: QuestionOption[];
  onSelectCount: (count: number) => void;
}

/**
 * Selector adaptativo de cantidad de preguntas para el lobby.
 * Muestra tres estados:
 *  - Menos de 4 palabras: mensaje de "configura preguntas" desactivado.
 *  - Entre 4 y 9 palabras: partida fijada al total disponible.
 *  - 10 o más palabras: grid de opciones seleccionables.
 *
 * Extraído de GameArena.tsx (G4 del plan de refactorización).
 */
export const QuestionCountSelector: React.FC<QuestionCountSelectorProps> = ({
  totalAvailableWords,
  totalQuestions,
  questionOptions,
  onSelectCount,
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-xs font-bold text-foreground/70 uppercase tracking-wider flex items-center gap-2">
          <Settings2 className="w-4 h-4" />
          Número de preguntas en la partida
        </label>
        {totalAvailableWords >= 10 && (
          <span className="text-xs text-muted-foreground">
            Máximo {totalAvailableWords} preguntas
          </span>
        )}
      </div>

      {totalAvailableWords < 4 ? (
        <div className="p-3.5 bg-background border border-dashed border-border rounded-2xl text-center text-xs text-muted-foreground">
          Selecciona categorías con al menos 4 palabras para configurar preguntas.
        </div>
      ) : totalAvailableWords < 10 ? (
        <div className="p-4 bg-primary/10 border border-primary/25 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-black text-sm shadow-sm">
              {totalAvailableWords}
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">
                Partida adaptativa con {totalAvailableWords} preguntas
              </p>
              <p className="text-[11px] text-muted-foreground">
                Se jugará con todas las palabras disponibles en tu selección actual.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-primary/20 text-primary border border-primary/30">
            Fijado a disponibles
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {questionOptions.map((opt) => {
            const isSelected = totalQuestions === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onSelectCount(opt.value)}
                className={`py-3 px-2 rounded-2xl font-black text-sm transition-all flex flex-col items-center justify-center gap-0.5 border ${
                  isSelected
                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30 scale-105'
                    : 'bg-background border-border hover:border-primary/40 text-foreground/80'
                }`}
              >
                <span>{opt.label}</span>
                {opt.isAll && (
                  <span
                    className={`text-[9px] font-semibold ${
                      isSelected ? 'text-white/80' : 'text-primary'
                    }`}
                  >
                    Catálogo completo
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
