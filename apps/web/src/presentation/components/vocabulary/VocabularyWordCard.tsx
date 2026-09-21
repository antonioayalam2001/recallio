import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Volume2 } from 'lucide-react';
import { CardActionMenu } from '../ui/CardActionMenu';
import { LEVEL_COLORS } from '../../constants/levels';
import type { Word } from '../../../domain/models/vocabulary';

interface VocabularyWordCardProps {
  word: Word;
  currentUserId?: string;
  currentUserRole?: string;
  isBookmarked: boolean;
  onEdit: () => void;
  onToggleSave: () => void;
  onDelete: () => void;
  speakWord: (word: string, e: React.MouseEvent) => void;
}

export const VocabularyWordCard: React.FC<VocabularyWordCardProps> = ({
  word,
  currentUserId,
  currentUserRole,
  isBookmarked,
  onEdit,
  onToggleSave,
  onDelete,
  speakWord,
}) => {
  const levelStyle = LEVEL_COLORS[word.level] || 'bg-primary/10 text-primary border-primary/20';

  const isAuthor = word.createdById === currentUserId;
  const isAdmin = currentUserRole === 'ADMIN';
  const canEditDirect = (isAuthor && (word.status as string) === 'PRIVATE') || isAdmin;
  const canDelete = isAdmin || (isAuthor && ((word.status as string) === 'PRIVATE' || word.status === 'PENDING_APPROVAL'));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className="glass-panel p-6 rounded-3xl border border-foreground/5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
    >
      <div>
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full border ${levelStyle}`}>
              {word.level}
            </span>
            <span className="opacity-50 text-[11px] font-bold uppercase tracking-wider bg-foreground/5 px-2.5 py-0.5 rounded-full">
              {word.category}
            </span>
            {(word.originalWordId || word.status === 'PENDING_APPROVAL') && (
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1"
                title="Esta es una propuesta de edición enviada para revisión"
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                Propuesta de edición
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={(e) => speakWord(word.englishWord, e)}
              className="p-1.5 rounded-full hover:bg-primary/10 text-foreground/50 hover:text-primary transition-colors"
              title="Escuchar pronunciación nativa"
            >
              <Volume2 className="w-4 h-4" />
            </button>

            <CardActionMenu
              editLabel={canEditDirect ? 'Editar palabra' : 'Sugerir corrección'}
              onEdit={onEdit}
              onToggleSave={onToggleSave}
              isBookmarked={isBookmarked}
              isAuthor={isAuthor && !isAdmin}
              onDelete={onDelete}
              canDelete={canDelete}
            />
          </div>
        </div>

        <div className="mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors tracking-tight break-words">
              {word.englishWord}
            </h3>
            {word.suggestionsCount && word.suggestionsCount > 0 ? (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px] font-bold uppercase tracking-wider">
                {word.suggestionsCount} {word.suggestionsCount === 1 ? 'Sugerencia' : 'Sugerencias'}
              </span>
            ) : null}
          </div>
          <p className="text-base font-bold opacity-80 mt-1 text-foreground/90">
            {word.spanishTranslation}
          </p>
        </div>
      </div>

      {word.exampleSentence && (
        <div className="bg-background/80 p-3.5 rounded-2xl text-xs border border-foreground/5 mt-auto">
              <span className="font-semibold text-foreground/80">&quot;{word.exampleSentence}&quot;</span>
          {word.exampleTranslation && (
            <p className="opacity-50 mt-1">{word.exampleTranslation}</p>
          )}
        </div>
      )}
    </motion.div>
  );
};
