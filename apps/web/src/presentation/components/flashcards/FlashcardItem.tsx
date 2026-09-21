import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { MarkdownContent } from './MarkdownContent';
import { CardActionMenu } from '../ui/CardActionMenu';
import type { Flashcard } from '../../../domain/models/flashcard';

interface FlashcardItemProps {
  card: Flashcard;
  toggleSave: (id: string) => Promise<boolean>;
  currentUserId?: string;
  currentUserRole?: string;
  onEdit: (card: Flashcard) => void;
  onDelete: (id: string) => void;
  onlyMyDeck: boolean;
  onRemoveFromDeck: () => void;
}

export const FlashcardItem: React.FC<FlashcardItemProps> = ({
  card,
  toggleSave,
  currentUserId,
  currentUserRole,
  onEdit,
  onDelete,
  onlyMyDeck,
  onRemoveFromDeck,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const cardData = card as Record<string, unknown>;
  const isAuthor = cardData.createdById === currentUserId;
  const isAdmin = currentUserRole === 'ADMIN';
  const canDelete = isAdmin || (isAuthor && ((card.status as string) === 'PRIVATE' || card.status === 'PENDING_APPROVAL'));
  const canEditDirect = (isAuthor && (card.status as string) === 'PRIVATE') || isAdmin;
  const isEditProposal = Boolean(card.originalFlashcardId || card.status === 'PENDING_APPROVAL');
  const [isBookmarked, setIsBookmarked] = useState(onlyMyDeck);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group relative h-72 [perspective:1000px] cursor-pointer select-none"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className="w-full h-full transition-transform duration-500 [transform-style:preserve-3d]"
        style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        <div className="absolute inset-0 [backface-visibility:hidden] bg-card border-2 border-primary/10 rounded-3xl p-6 shadow-sm flex flex-col">
          <div className="flex flex-col gap-1 mb-3 border-b border-foreground/5 pb-2">
            <div className="flex justify-between items-center gap-2">
              <div className="flex items-center gap-1.5 flex-wrap truncate">
                <span className="text-xs font-bold text-primary px-2.5 py-1 bg-primary/10 rounded-md truncate max-w-[120px]">
                  {card.groupName || card.group?.name || 'General'}
                </span>
                {isEditProposal && (
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1 shrink-0"
                    title="Esta es una propuesta de edición enviada para revisión"
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    Propuesta de edición
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-bold opacity-50 truncate max-w-[110px]">
                  {card.categoryName || card.category?.name || 'General'}
                </span>

                <CardActionMenu
                  editLabel={canEditDirect ? 'Editar tarjeta' : 'Sugerir corrección'}
                  onEdit={() => onEdit(card)}
                  onToggleSave={async () => {
                    const saved = await toggleSave(card.id);
                    setIsBookmarked(saved);
                    if (onlyMyDeck && !saved) {
                      onRemoveFromDeck();
                    }
                  }}
                  isBookmarked={isBookmarked}
                  isAuthor={isAuthor && !isAdmin}
                  onDelete={() => onDelete(card.id)}
                  canDelete={canDelete}
                />
              </div>
            </div>
            <span className="text-[10px] font-semibold opacity-40 uppercase tracking-widest pl-1 truncate">
              {card.topicName || card.topic?.name || 'General'}
            </span>
          </div>

          <div
            className="flex-1 overflow-y-auto custom-scrollbar my-auto prose prose-sm dark:prose-invert max-w-none pr-1.5"
            onClick={(e) => {
              const selection = window.getSelection();
              if (selection && selection.toString().length > 0) {
                e.stopPropagation();
              }
            }}
          >
            <MarkdownContent content={card.front} />
          </div>

          <div className="mt-3 pt-2 border-t border-foreground/5 text-center text-xs opacity-30 font-bold uppercase tracking-widest shrink-0">
            Clic para ver la respuesta
          </div>
        </div>

        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-primary/5 border-2 border-primary/20 rounded-3xl p-6 shadow-sm flex flex-col">
          <div className="flex-1 overflow-y-auto custom-scrollbar my-auto prose prose-sm dark:prose-invert max-w-none pr-1.5">
            <MarkdownContent content={card.back} />
          </div>
          <div className="mt-3 pt-2 border-t border-primary/10 text-center text-xs opacity-30 font-bold uppercase tracking-widest shrink-0">
            Clic para ver la pregunta
          </div>
        </div>
      </div>
    </motion.div>
  );
};
