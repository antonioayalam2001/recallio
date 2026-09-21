import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { Word } from '../../../domain/models/vocabulary';

interface DeleteWordDialogProps {
  wordToDelete: string | undefined;
  onClose: () => void;
  words: Word[];
  currentUserRole?: string;
  onConfirmDelete: (id: string) => Promise<void>;
}

export const DeleteWordDialog: React.FC<DeleteWordDialogProps> = ({
  wordToDelete,
  onClose,
  words,
  currentUserRole,
  onConfirmDelete,
}) => {
  return (
    <Dialog open={!!wordToDelete} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-background border border-border shadow-xl rounded-2xl">
        {(() => {
          const targetWord = words.find((w) => w.id === wordToDelete);
          const isEditProposal = Boolean(targetWord?.originalWordId || targetWord?.status === 'PENDING_APPROVAL');
          const isPrivateWord = (targetWord?.status as string) === 'PRIVATE';
          const isAdmin = currentUserRole === 'ADMIN';

          let title = 'Confirmar eliminación';
          let description = '¿Estás seguro de que deseas eliminar esta palabra? Esta acción no se puede deshacer.';
          let buttonLabel = 'Eliminar';

          if (isEditProposal) {
            title = 'Eliminar propuesta de edición';
            description =
              'Estás por eliminar esta propuesta de cambio. La palabra original pública no se verá afectada y permanecerá intacta en el sistema. ¿Deseas continuar?';
            buttonLabel = 'Eliminar propuesta';
          } else if (isPrivateWord) {
            title = 'Eliminar palabra privada';
            description =
              '¿Estás seguro de que deseas eliminar permanentemente esta palabra de tu colección personal? Esta acción no se puede deshacer.';
          } else if (isAdmin) {
            title = 'Eliminar palabra del diccionario';
            description =
              'Como administrador, estás por eliminar permanentemente esta palabra pública para todos los usuarios de la plataforma. ¿Deseas continuar?';
          }

          return (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-black text-foreground">{title}</DialogTitle>
                <DialogDescription className="text-muted-foreground pt-2">{description}</DialogDescription>
              </DialogHeader>
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button
                  className="bg-red-500 hover:bg-red-600 text-white font-bold"
                  onClick={async () => {
                    if (wordToDelete) {
                      await onConfirmDelete(wordToDelete);
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
