import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Edit3 } from 'lucide-react';
import { MarkdownContent } from '../flashcards/MarkdownContent';
import type { Flashcard } from '../../../domain/models/flashcard';

interface FlashcardComparisonCardProps {
  card: Flashcard;
  isActionLoading: boolean;
  onModerate: (cardId: string, status: 'APPROVED' | 'REJECTED') => void;
}

export const FlashcardComparisonCard: React.FC<FlashcardComparisonCardProps> = ({
  card,
  isActionLoading,
  onModerate,
}) => {
  const isSuggestion = Boolean(card.originalFlashcardId);
  const original = card.originalFlashcard;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`bg-background rounded-2xl border ${
        isSuggestion ? 'border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.08)]' : 'border-primary/10 shadow-sm'
      } overflow-hidden flex flex-col`}
    >
      {/* Header */}
      <div className="p-4 border-b border-foreground/5 flex flex-wrap justify-between items-center bg-foreground/[0.02] gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {isSuggestion ? (
            <span className="flex items-center gap-1.5 bg-amber-500/15 text-amber-600 dark:text-amber-400 text-xs font-black px-3 py-1 rounded-full border border-amber-500/30">
              <Edit3 className="w-3.5 h-3.5" /> Sugerencia de Edición
            </span>
          ) : (
            <span className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-black px-3 py-1 rounded-full border border-emerald-500/30">
              Nueva Flashcard
            </span>
          )}
          <span className="text-xs font-bold text-primary px-2 py-0.5 bg-primary/10 rounded">
            {(card as Record<string, string>).topicName || card.topic?.name || 'General'}
          </span>
          <span className="text-xs opacity-70">
            {(card as Record<string, string>).categoryName || card.category?.name || 'General'}
          </span>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          {(card as Record<string, string>).createdByName && (
            <span className="text-xs font-medium bg-primary/10 text-primary px-2.5 py-1 rounded-md">
              Por: {(card as Record<string, string>).createdByName}
            </span>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => onModerate(card.id, 'REJECTED')}
              disabled={isActionLoading}
              className="flex items-center gap-1 bg-error/10 text-error hover:bg-error hover:text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
            >
              <X className="w-4 h-4" /> {isSuggestion ? 'Rechazar' : 'Rechazar'}
            </button>
            <button
              onClick={() => onModerate(card.id, 'APPROVED')}
              disabled={isActionLoading}
              className="flex items-center gap-1 bg-success/10 text-success hover:bg-success hover:text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
            >
              <Check className="w-4 h-4" /> {isSuggestion ? 'Aprobar y Actualizar' : 'Aprobar'}
            </button>
          </div>
        </div>
      </div>

      {/* Body / Comparison */}
      {isSuggestion && original ? (
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Original */}
          <div className="p-4 rounded-xl bg-foreground/[0.02] border border-foreground/5 flex flex-col gap-3">
            <span className="text-xs font-black uppercase tracking-wider text-muted-foreground border-b pb-1">
              Tarjeta Original
            </span>
            <div>
              <span className="text-[11px] font-bold opacity-50 uppercase tracking-wider block mb-1">
                Anverso (Frente)
              </span>
              <div className="prose prose-sm dark:prose-invert max-w-none bg-background/50 p-3 rounded-lg text-muted-foreground">
                <MarkdownContent content={original.front} />
              </div>
            </div>
            <div>
              <span className="text-[11px] font-bold opacity-50 uppercase tracking-wider block mb-1">
                Reverso (Respuesta)
              </span>
              <div className="prose prose-sm dark:prose-invert max-w-none bg-background/50 p-3 rounded-lg text-muted-foreground">
                <MarkdownContent content={original.back} />
              </div>
            </div>
          </div>

          {/* Proposed */}
          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 flex flex-col gap-3">
            <span className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 border-b border-amber-500/20 pb-1">
              Propuesta Sugerida
            </span>
            <div>
              <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block mb-1">
                Anverso (Frente)
              </span>
              <div className="prose prose-sm dark:prose-invert max-w-none bg-background p-3 rounded-lg shadow-sm">
                <MarkdownContent content={card.front} />
              </div>
            </div>
            <div>
              <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block mb-1">
                Reverso (Respuesta)
              </span>
              <div className="prose prose-sm dark:prose-invert max-w-none bg-background p-3 rounded-lg shadow-sm border border-amber-500/20">
                <MarkdownContent content={card.back} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-5 flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-xs font-bold opacity-50 uppercase tracking-wider block mb-1">
              Anverso (Frente)
            </span>
            <div className="prose prose-sm dark:prose-invert max-w-none bg-foreground/[0.02] p-3 rounded-xl min-h-[80px]">
              <MarkdownContent content={card.front} />
            </div>
          </div>
          <div>
            <span className="text-xs font-bold opacity-50 uppercase tracking-wider block mb-1">
              Reverso (Respuesta)
            </span>
            <div className="prose prose-sm dark:prose-invert max-w-none bg-primary/5 p-3 rounded-xl border border-primary/10 min-h-[80px]">
              <MarkdownContent content={card.back} />
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
