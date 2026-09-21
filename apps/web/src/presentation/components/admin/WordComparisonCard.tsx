import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Edit3 } from 'lucide-react';
import type { Word } from '../../../domain/models/vocabulary';

interface WordComparisonCardProps {
  word: Word;
  isActionLoading: boolean;
  onModerate: (wordId: string, status: 'APPROVED' | 'REJECTED') => void;
}

export const WordComparisonCard: React.FC<WordComparisonCardProps> = ({
  word,
  isActionLoading,
  onModerate,
}) => {
  const isSuggestion = Boolean(word.originalWordId);
  const original = word.originalWord;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50, scale: 0.95 }}
      className={`flex flex-col bg-background p-6 rounded-2xl border ${
        isSuggestion ? 'border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.08)]' : 'border-primary/10 shadow-sm'
      } gap-5`}
    >
      {/* Header with Badges */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-foreground/5 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          {isSuggestion ? (
            <span className="flex items-center gap-1.5 bg-amber-500/15 text-amber-600 dark:text-amber-400 text-xs font-black px-3 py-1 rounded-full border border-amber-500/30">
              <Edit3 className="w-3.5 h-3.5" /> Sugerencia de Edición
            </span>
          ) : (
            <span className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-black px-3 py-1 rounded-full border border-emerald-500/30">
              Nueva Palabra
            </span>
          )}
          <span className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-md">
            {word.level}
          </span>
          <span className="bg-slate-500/10 text-xs font-bold px-2.5 py-1 rounded-md">
            {word.category}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 w-full sm:w-auto ml-auto">
          <button
            onClick={() => onModerate(word.id, 'REJECTED')}
            disabled={isActionLoading}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-error/10 text-error hover:bg-error hover:text-white px-4 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
          >
            <X className="w-4 h-4" /> {isSuggestion ? 'Rechazar Propuesta' : 'Rechazar'}
          </button>
          <button
            onClick={() => onModerate(word.id, 'APPROVED')}
            disabled={isActionLoading}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-success/10 text-success hover:bg-success hover:text-white px-4 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
          >
            <Check className="w-4 h-4" /> {isSuggestion ? 'Aprobar y Actualizar' : 'Aprobar'}
          </button>
        </div>
      </div>

      {/* Content / Comparison */}
      {isSuggestion && original ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Original */}
          <div className="p-4 rounded-xl bg-foreground/[0.02] border border-foreground/5 flex flex-col gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Valor Original
            </span>
            <div>
              <h4 className="text-lg font-bold text-foreground/80 line-through decoration-red-500/50">
                {original.englishWord}{' '}
                <span className="text-sm font-normal opacity-70">
                  ({original.spanishTranslation})
                </span>
              </h4>
              <div className="flex gap-2 mt-1">
                <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                  {original.level}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                  {original.category}
                </span>
              </div>
              {original.exampleSentence && (
                <p className="text-xs italic text-muted-foreground mt-2 border-l-2 pl-2">
                  &quot;{original.exampleSentence}&quot;
                </p>
              )}
            </div>
          </div>

          {/* Proposed */}
          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 flex flex-col gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Propuesta del Usuario
            </span>
            <div>
              <h4 className="text-lg font-bold text-foreground">
                {word.englishWord}{' '}
                <span className="text-sm font-normal opacity-70">
                  ({word.spanishTranslation})
                </span>
              </h4>
              <div className="flex gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                  word.level !== original.level ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold' : 'bg-muted text-muted-foreground'
                }`}>
                  {word.level}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                  word.category !== original.category ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold' : 'bg-muted text-muted-foreground'
                }`}>
                  {word.category}
                </span>
              </div>
              {word.exampleSentence && (
                <p className="text-xs italic text-foreground/80 mt-2 border-l-2 border-amber-500/40 pl-2">
                  &quot;{word.exampleSentence}&quot;
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h4 className="text-xl font-bold">
            {word.englishWord}{' '}
            <span className="opacity-50 text-base font-normal">
              ({word.spanishTranslation})
            </span>
          </h4>
          {word.exampleSentence && (
            <p className="text-sm italic text-muted-foreground mt-1 border-l-2 pl-3">
              &quot;{word.exampleSentence}&quot;
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
};
