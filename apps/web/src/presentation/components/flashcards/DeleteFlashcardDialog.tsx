import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Flashcard } from '../../../domain/models/flashcard';

interface DeleteFlashcardDialogProps {
  cardToDelete: string | null;
  onClose: () => void;
  cards: Flashcard[];
  currentUserRole?: string;
  onConfirmDelete: (id: string) => Promise<void>;
}

export const DeleteFlashcardDialog: React.FC<DeleteFlashcardDialogProps> = ({
  cardToDelete,
  onClose,
  cards,
  currentUserRole,
  onConfirmDelete,
}) => {
  return (
    <Dialog open={!!cardToDelete} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-background border border-border shadow-xl rounded-2xl">
        {(() => {
          const targetCard = cards.find((c) => c.id === cardToDelete);
          const isEditProposal = Boolean(targetCard?.originalFlashcardId || targetCard?.status === 'PENDING_APPROVAL');
          const isPrivateCard = (targetCard?.status as string) === 'PRIVATE';
          const isAdmin = currentUserRole === 'ADMIN';

          let title = 'Confirmar eliminación';
          let description = '¿Estás seguro de que deseas eliminar esta tarjeta de estudio? Esta acción no se puede deshacer.';
          let buttonLabel = 'Eliminar';

          if (isEditProposal) {
            title = 'Eliminar propuesta de edición';
            description =
              'Estás por eliminar esta sugerencia de cambio. La tarjeta original pública no se verá afectada y permanecerá intacta en el catálogo. ¿Deseas continuar?';
            buttonLabel = 'Eliminar propuesta';
          } else if (isPrivateCard) {
            title = 'Eliminar tarjeta privada';
            description =
              '¿Estás seguro de que deseas eliminar permanentemente esta tarjeta de tu mazo personal? Esta acción no se puede deshacer.';
          } else if (isAdmin) {
            title = 'Eliminar tarjeta del catálogo';
            description =
              'Como administrador, estás por eliminar permanentemente esta flashcard del sistema para todos los usuarios. ¿Deseas continuar?';
          }

          return (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-black text-foreground">{title}</DialogTitle>
                <DialogDescription className="text-muted-foreground pt-2">
                  {description}
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  className="bg-red-500 hover:bg-red-600 text-white font-bold"
                  onClick={async () => {
                    if (cardToDelete) {
                      await onConfirmDelete(cardToDelete);
                      onClose();
                    }
                  }}
                >
                  {buttonLabel}
                </Button>
              </div>
            </>
          );
        })()}
      </DialogContent>
    </Dialog>
  );
};
