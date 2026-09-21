import React from 'react';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ConfirmDeleteDialogProps {
  /** Controla si el diálogo está abierto */
  open: boolean;
  /** Callback para cerrar el diálogo sin confirmar */
  onClose: () => void;
  /** Callback ejecutado al confirmar la eliminación */
  onConfirm: () => void | Promise<void>;
  /** Título del diálogo (default: 'Confirmar eliminación') */
  title?: string;
  /** Descripción / mensaje de advertencia */
  description?: string;
  /** Texto del botón de confirmación (default: 'Eliminar') */
  confirmLabel?: string;
  /** Si la acción de confirmación está en progreso */
  isLoading?: boolean;
}

/**
 * Diálogo genérico de confirmación de eliminación.
 * Reemplaza los dialogs duplicados en VocabularyView, FlashcardCatalog y similares.
 *
 * @component ConfirmDeleteDialog
 * @example
 * <ConfirmDeleteDialog
 *   open={!!wordToDelete}
 *   onClose={() => setWordToDelete(null)}
 *   onConfirm={handleDelete}
 *   title="Eliminar palabra"
 *   description="¿Estás seguro? Esta acción no se puede deshacer."
 *   isLoading={isDeleting}
 * />
 */
export const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title = 'Confirmar eliminación',
  description = '¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.',
  confirmLabel = 'Eliminar',
  isLoading = false,
}) => {
  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md bg-background border border-border shadow-xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-foreground">{title}</DialogTitle>
          <DialogDescription className="text-muted-foreground pt-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            className="bg-red-500 hover:bg-red-600 text-white font-bold disabled:opacity-50"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              confirmLabel
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
