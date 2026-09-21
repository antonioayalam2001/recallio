import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCw, Check, X, ArrowLeft, Zap, Clock } from 'lucide-react';
import { MarkdownContent } from './MarkdownContent';
import { FlashcardSummary } from './FlashcardSummary';
import { useFlashcards } from '../../../application/useFlashcards';
import type { Flashcard } from '../../../domain/models/flashcard';

interface FlashcardDeckProps {
  cards: Flashcard[];
  topicTitle?: string;
  categoryTitle?: string;
  onExit: () => void;
}

export const FlashcardDeck: React.FC<FlashcardDeckProps> = ({
  cards,
  topicTitle,
  categoryTitle,
  onExit,
}) => {
  const { submitStudySession, reviewFlashcard } = useFlashcards();
  const [queue, setQueue] = useState<Flashcard[]>([...cards]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Estadísticas
  const [initialTotal] = useState(cards.length);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [firstAttemptCorrect] = useState<Set<string>>(new Set());
  const [attemptsPerCard] = useState<Map<string, number>>(new Map());

  // eslint-disable-next-line security/detect-object-injection
  const currentCard = queue[currentIndex];

  const handleFlip = () => setIsFlipped(!isFlipped);

  const handleAnswer = async (quality: number) => {
    if (isFlipped) {
      setIsFlipped(false);
      setTotalAttempts((t) => t + 1);

      const isCorrect = quality >= 3;
      const cardId = currentCard.id;
      const currentAttempts = attemptsPerCard.get(cardId) || 0;
      attemptsPerCard.set(cardId, currentAttempts + 1);

      const isFirstTime = currentAttempts === 0;

      if (isCorrect && isFirstTime) {
        firstAttemptCorrect.add(cardId);
      }

      // Enviar el review SM-2 al backend
      await reviewFlashcard(cardId, quality);

      // Si falla (calidad < 3), agregamos la carta de nuevo al final de la cola
      if (!isCorrect) {
        setQueue((prev) => [...prev, currentCard]);
      }

      if (currentIndex + 1 >= queue.length + (!isCorrect ? 1 : 0)) {
        setIsCompleted(true);
        await submitStudySession({
          topicId: currentCard.topic?.id,
          categoryId: currentCard.category?.id,
          totalCards: initialTotal,
          correctOnFirstTry: firstAttemptCorrect.size + (isCorrect && isFirstTime ? 1 : 0),
          totalAttempts: totalAttempts + 1,
        });
      } else {
        setTimeout(() => setCurrentIndex((i) => i + 1), 150);
      }
    }
  };

  if (isCompleted) {
    return (
      <FlashcardSummary
        totalCards={initialTotal}
        correctOnFirstTry={firstAttemptCorrect.size}
        totalAttempts={totalAttempts}
        onRestart={() => {
          setQueue([...cards]);
          setCurrentIndex(0);
          setIsFlipped(false);
          setIsCompleted(false);
          setTotalAttempts(0);
          firstAttemptCorrect.clear();
          attemptsPerCard.clear();
        }}
        onExit={onExit}
      />
    );
  }

  if (!currentCard) return null;

  return (
    <div className="w-full max-w-4xl mx-auto relative h-[80vh] flex flex-col pt-10">
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={onExit}
          className="flex items-center gap-2 font-bold text-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Salir del Estudio
        </button>
        <div className="text-right">
          <div className="text-xs font-bold opacity-50 uppercase tracking-widest mb-1">
            {topicTitle || 'General'} • {categoryTitle || 'General'}
          </div>
          <div className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full inline-block">
            Tarjeta {currentIndex + 1} de {queue.length}
          </div>
        </div>
      </div>

      <div className="flex-1 relative [perspective:2000px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex + (isFlipped ? '-back' : '-front')}
            initial={{ opacity: 0, rotateX: isFlipped ? -90 : 90, scale: 0.9 }}
            animate={{ opacity: 1, rotateX: 0, scale: 1 }}
            exit={{ opacity: 0, rotateX: isFlipped ? 90 : -90, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className={`absolute inset-0 rounded-3xl p-8 shadow-2xl flex flex-col cursor-pointer border-2 ${
              isFlipped ? 'bg-primary/5 border-primary/20' : 'bg-card border-primary/10'
            }`}
            onClick={!isFlipped ? handleFlip : undefined}
          >
            <div className="flex-1 flex flex-col justify-center items-center text-center prose prose-lg dark:prose-invert max-w-none w-full">
              {!isFlipped ? (
                <>
                  <span className="text-xs font-bold opacity-50 uppercase tracking-widest mb-6 block text-center w-full">
                    Anverso (Frente)
                  </span>
                  <div className="w-full">
                    <MarkdownContent content={currentCard.front} />
                  </div>
                </>
              ) : (
                <>
                  <span className="text-xs font-bold opacity-50 uppercase tracking-widest mb-6 block text-center w-full">
                    Reverso (Respuesta)
                  </span>
                  <div className="w-full">
                    <MarkdownContent content={currentCard.back} />
                  </div>
                </>
              )}
            </div>

            {!isFlipped && (
              <div className="mt-8 text-center flex items-center justify-center gap-2 opacity-50 font-bold uppercase tracking-widest text-xs">
                <RotateCw className="w-4 h-4" /> Haz clic para girar
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div
        className={`mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 transition-all duration-300 ${isFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
      >
        <button
          onClick={() => handleAnswer(0)}
          className="bg-error/10 hover:bg-error hover:text-white text-error border border-error/20 rounded-2xl py-4 font-black text-sm flex flex-col items-center justify-center gap-1 transition-all"
        >
          <X className="w-5 h-5 mb-1" /> Fallo (Repetir)
        </button>
        <button
          onClick={() => handleAnswer(3)}
          className="bg-amber-500/10 hover:bg-amber-500 hover:text-white text-amber-500 border border-amber-500/20 rounded-2xl py-4 font-black text-sm flex flex-col items-center justify-center gap-1 transition-all"
        >
          <Clock className="w-5 h-5 mb-1" /> Difícil
        </button>
        <button
          onClick={() => handleAnswer(4)}
          className="bg-success/10 hover:bg-success hover:text-white text-success border border-success/20 rounded-2xl py-4 font-black text-sm flex flex-col items-center justify-center gap-1 transition-all"
        >
          <Check className="w-5 h-5 mb-1" /> Bien
        </button>
        <button
          onClick={() => handleAnswer(5)}
          className="bg-blue-500/10 hover:bg-blue-500 hover:text-white text-blue-500 border border-blue-500/20 rounded-2xl py-4 font-black text-sm flex flex-col items-center justify-center gap-1 transition-all"
        >
          <Zap className="w-5 h-5 mb-1" /> Fácil
        </button>
      </div>
    </div>
  );
};
