import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Pantalla de carga que se muestra mientras se genera la partida.
 * Extraído de GameArena.tsx (G9 del plan de refactorización).
 */
export const GameLoadingScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
      <p className="font-bold opacity-70">Generando partida personalizada...</p>
    </div>
  );
};
