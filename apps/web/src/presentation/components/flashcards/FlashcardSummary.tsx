import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, CheckCircle, RotateCcw, ArrowLeft, Zap } from 'lucide-react';

interface FlashcardSummaryProps {
  totalCards: number;
  correctOnFirstTry: number;
  totalAttempts: number;
  onRestart: () => void;
  onExit: () => void;
}

/**
 * Vista de resumen al completar una sesión de estudio de Flashcards con Active Recall.
 *
 * @component FlashcardSummary
 */
export const FlashcardSummary: React.FC<FlashcardSummaryProps> = ({
  totalCards,
  correctOnFirstTry,
  totalAttempts,
  onRestart,
  onExit,
}) => {
  const masteryPercentage = Math.round((correctOnFirstTry / Math.max(totalCards, 1)) * 100);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 w-full max-w-xl mx-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-card text-card-foreground p-8 md:p-10 rounded-3xl shadow-2xl border border-primary/20 w-full text-center relative overflow-hidden"
      >
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

        <div className="inline-flex p-5 rounded-full bg-primary/10 text-primary mb-6 shadow-inner">
          <Trophy className="w-14 h-14" />
        </div>

        <h2 className="text-3xl md:text-4xl font-black mb-2 text-primary">¡Mazo Completado!</h2>
        <p className="opacity-70 mb-8 text-base">
          Has repasado y dominado todas las tarjetas de esta sesión de estudio.
        </p>

        {/* Métricas */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-background/80 p-4 rounded-2xl border border-primary/10">
            <CheckCircle className="w-6 h-6 text-success mx-auto mb-1" />
            <div className="text-2xl font-black">{totalCards}</div>
            <div className="text-xs font-semibold opacity-60">Dominadas</div>
          </div>

          <div className="bg-background/80 p-4 rounded-2xl border border-primary/10">
            <Zap className="w-6 h-6 text-warning mx-auto mb-1" />
            <div className="text-2xl font-black">{masteryPercentage}%</div>
            <div className="text-xs font-semibold opacity-60">Al 1er Intento</div>
          </div>

          <div className="bg-background/80 p-4 rounded-2xl border border-primary/10">
            <RotateCcw className="w-6 h-6 text-primary mx-auto mb-1" />
            <div className="text-2xl font-black">{totalAttempts}</div>
            <div className="text-xs font-semibold opacity-60">Repasos Totales</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onRestart}
            className="flex-1 py-3.5 px-6 font-bold rounded-2xl bg-primary text-white flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-[0_4px_15px_rgba(244,63,94,0.3)]"
          >
            <RotateCcw className="w-5 h-5" /> Repasar de Nuevo
          </button>
          <button
            onClick={onExit}
            className="flex-1 py-3.5 px-6 font-bold rounded-2xl bg-background hover:bg-background/80 border border-primary/10 flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" /> Volver al Catálogo
          </button>
        </div>
      </motion.div>
    </div>
  );
};
