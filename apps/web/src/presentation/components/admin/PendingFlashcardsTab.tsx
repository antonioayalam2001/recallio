import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { FlashcardComparisonCard } from './FlashcardComparisonCard';
import type { Flashcard } from '../../../domain/models/flashcard';

interface PendingFlashcardsTabProps {
  pendingCards: Flashcard[];
  isLoadingCards: boolean;
  isActionLoading: boolean;
  moderateCard: (cardId: string, status: 'APPROVED' | 'REJECTED') => void;
}

export const PendingFlashcardsTab: React.FC<PendingFlashcardsTabProps> = ({
  pendingCards,
  isLoadingCards,
  isActionLoading,
  moderateCard,
}) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h3 className="text-2xl font-black mb-6">Flashcards Pendientes de Aprobación</h3>
      {isLoadingCards ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : pendingCards.length === 0 ? (
        <div className="text-center py-20 opacity-50">
          No hay flashcards pendientes de aprobación.
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <AnimatePresence>
            {pendingCards.map((card) => (
              <FlashcardComparisonCard
                key={card.id}
                card={card}
                isActionLoading={isActionLoading}
                onModerate={moderateCard}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};
