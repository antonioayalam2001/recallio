import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { WordComparisonCard } from './WordComparisonCard';
import type { Word } from '../../../domain/models/vocabulary';

interface PendingWordsTabProps {
  pendingWords: Word[];
  isLoadingWords: boolean;
  isActionLoading: boolean;
  moderateWord: (wordId: string, status: 'APPROVED' | 'REJECTED') => void;
}

export const PendingWordsTab: React.FC<PendingWordsTabProps> = ({
  pendingWords,
  isLoadingWords,
  isActionLoading,
  moderateWord,
}) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h3 className="text-2xl font-black mb-6">Palabras de Vocabulario Pendientes</h3>
      {isLoadingWords ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : pendingWords.length === 0 ? (
        <div className="text-center py-20 opacity-50">
          No hay palabras pendientes de aprobación.
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <AnimatePresence>
            {pendingWords.map((word) => (
              <WordComparisonCard
                key={word.id}
                word={word}
                isActionLoading={isActionLoading}
                onModerate={moderateWord}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};
