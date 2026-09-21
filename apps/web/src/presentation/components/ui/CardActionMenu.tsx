import React, { useState } from 'react';
import { MoreVertical, Edit3, Bookmark, Trash2, Check } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

export interface CardActionMenuProps {
  onEdit?: () => void;
  editLabel?: string;
  onToggleSave?: () => void;
  isBookmarked?: boolean;
  isAuthor?: boolean;
  onDelete?: () => void;
  canDelete?: boolean;
  className?: string;
}

export const CardActionMenu: React.FC<CardActionMenuProps> = ({
  onEdit,
  editLabel = 'Editar',
  onToggleSave,
  isBookmarked = false,
  isAuthor = false,
  onDelete,
  canDelete = false,
  className = '',
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`relative inline-block ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
            className="p-1.5 rounded-full hover:bg-foreground/10 text-foreground/60 hover:text-foreground transition-colors focus:outline-none"
            title="Opciones de la tarjeta"
            aria-label="Opciones"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </PopoverTrigger>

        <PopoverContent
          align="end"
          sideOffset={6}
          className="w-48 p-1.5 bg-card/95 backdrop-blur-md border border-border shadow-xl rounded-2xl flex flex-col gap-0.5 z-50"
          onClick={(e) => e.stopPropagation()}
        >
          {/* EDITAR / SUGERIR */}
          {onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                onEdit();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-foreground/80 hover:text-foreground hover:bg-primary/10 rounded-xl transition-colors text-left"
            >
              <Edit3 className="w-3.5 h-3.5 text-primary" />
              <span>{editLabel}</span>
            </button>
          )}

          {/* GUARDAR / REMOVER FAVORITOS */}
          {onToggleSave && !isAuthor && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                onToggleSave();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-foreground/80 hover:text-foreground hover:bg-primary/10 rounded-xl transition-colors text-left"
            >
              <Bookmark
                className="w-3.5 h-3.5 text-primary"
                fill={isBookmarked ? 'currentColor' : 'none'}
              />
              <span>{isBookmarked ? 'Quitar de mi mazo' : 'Guardar en mi mazo'}</span>
            </button>
          )}

          {/* INDICADOR AUTOR */}
          {isAuthor && (
            <div className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-foreground/40 cursor-default">
              <Check className="w-3.5 h-3.5 text-primary" />
              <span>Eres el autor</span>
            </div>
          )}

          {/* ELIMINAR */}
          {canDelete && onDelete && (
            <>
              <div className="h-px bg-border/60 my-1 mx-2" />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                  onDelete();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-500/10 rounded-xl transition-colors text-left"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-500" />
                <span>Eliminar</span>
              </button>
            </>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};
