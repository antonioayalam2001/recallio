import React from 'react';
import { motion } from 'framer-motion';
import type { GameQuestion } from '../../../application/useGame';

interface WordCardProps {
  question: GameQuestion;
  timeLeft: number;
}

export const WordCardContent: React.FC<WordCardProps> = ({ question, timeLeft }) => (
  <div className="bg-card text-card-foreground p-8 rounded-3xl shadow-xl w-full h-full max-w-lg mx-auto text-center border-2 border-primary/10 relative overflow-hidden flex flex-col justify-center items-center">
    <div className="absolute top-0 left-0 w-full h-2 bg-slate-200 dark:bg-slate-800">
      <div
        className="h-full bg-primary transition-all duration-1000 ease-linear"
        style={{ width: `${(timeLeft / 15) * 100}%` }}
      />
    </div>

    <h4 className="uppercase tracking-widest text-xs font-bold opacity-60 mt-4 mb-2">
      {question.level} • {question.category}
    </h4>
    <h2 className="text-5xl font-black mb-6 text-primary tracking-tight">{question.englishWord}</h2>

    <div className="flex items-center justify-center gap-2 text-2xl font-bold opacity-80">
      ⏱ {timeLeft}s
    </div>
  </div>
);

export const WordCard: React.FC<WordCardProps> = (props) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="w-full max-w-lg mx-auto h-64"
    >
      <WordCardContent {...props} />
    </motion.div>
  );
};
