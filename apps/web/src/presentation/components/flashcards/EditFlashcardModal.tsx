import React from 'react';
import { Edit3, Loader2, Sparkles, ShieldAlert } from 'lucide-react';
import { useFlashcards } from '../../../application/useFlashcards';
import { AdaptiveSheet } from '../ui/AdaptiveSheet';
import { CreatableCombobox } from '@/components/ui/CreatableCombobox';
import { MarkdownEditor } from '../ui/MarkdownEditor';
import { useEditFlashcardForm } from './hooks/useEditFlashcardForm';
import type { Group, Flashcard } from '../../../domain/models/flashcard';

interface EditFlashcardModalProps {
  isOpen: boolean;
  onClose: () => void;
  taxonomies: Group[];
  card: Flashcard | null;
  isPrivateCard: boolean;
  isAdmin?: boolean;
  onUpdated: () => void;
}

export const EditFlashcardModal: React.FC<EditFlashcardModalProps> = ({
  isOpen,
  onClose,
  taxonomies,
  card,
  isPrivateCard,
  isAdmin = false,
  onUpdated,
}) => {
  const { updateFlashcard, suggestFlashcardEdit } = useFlashcards();
  const canEditDirect = isPrivateCard || isAdmin;

  const {
    form: { register, handleSubmit, errors },
    values: { frontValue, backValue, selectedGroup, selectedTopic, selectedCategory },
    taxonomiesDerived: { availableTopics, availableCategories },
    handlers: { handleGroupChange, handleTopicChange, handleCategoryChange, onSubmit },
    isSubmitting,
  } = useEditFlashcardForm({
    taxonomies,
    card,
    isOpen,
    canEditDirect,
    updateFlashcard,
    suggestFlashcardEdit,
    onUpdated,
    onClose,
  });

  return (
    <AdaptiveSheet
      isOpen={isOpen}
      onClose={onClose}
      title={
        <span className="flex items-center gap-2">
          {canEditDirect ? (
            <>
              <Edit3 className="w-6 h-6 text-primary" /> Editar Tarjeta {isPrivateCard ? 'Privada' : 'Pública'}
            </>
          ) : (
            <>
              <Sparkles className="w-6 h-6 text-primary" /> Sugerir Mejora en Tarjeta Pública
            </>
          )}
        </span>
      }
      description={
        canEditDirect
          ? 'Modifica el contenido de la tarjeta. Los cambios se aplicarán inmediatamente.'
          : 'Propón una mejora o corrección para esta tarjeta pública. Será revisada por un administrador.'
      }
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5 mt-2">
        {!canEditDirect && (
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-start gap-3 text-xs text-foreground/80">
            <ShieldAlert className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-foreground">Revisión requerida</p>
              <p className="opacity-80">
                Al enviar esta propuesta, entrará en la cola de moderación. Una vez aprobada por un administrador, los cambios se reflejarán para todos los usuarios.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* SELECCIÓN DE GRUPO */}
          <div>
            <label className="text-xs font-bold opacity-80 mb-1 block">Grupo *</label>
            <CreatableCombobox
              options={taxonomies.map((g) => ({ value: g.name, label: g.name }))}
              value={selectedGroup}
              onChange={handleGroupChange}
              placeholder="Seleccionar Grupo..."
              onCreateNew={handleGroupChange}
              disabled={!canEditDirect}
            />
            {errors.groupName && (
              <span className="text-error text-xs mt-1 block">{errors.groupName.message}</span>
            )}
          </div>

          {/* SELECCIÓN DE TEMA */}
          <div>
            <label className="text-xs font-bold opacity-80 mb-1 block">Tema *</label>
            <CreatableCombobox
              options={availableTopics.map((t) => ({ value: t.name, label: t.name }))}
              value={selectedTopic}
              onChange={handleTopicChange}
              placeholder="Seleccionar Tema..."
              onCreateNew={handleTopicChange}
              disabled={!selectedGroup || !canEditDirect}
            />
            {errors.topicName && (
              <span className="text-error text-xs mt-1 block">{errors.topicName.message}</span>
            )}
          </div>

          {/* SELECCIÓN DE CATEGORÍA */}
          <div>
            <label className="text-xs font-bold opacity-80 mb-1 block">Categoría *</label>
            <CreatableCombobox
              options={availableCategories.map((c) => ({ value: c.name, label: c.name }))}
              value={selectedCategory}
              onChange={handleCategoryChange}
              placeholder="Seleccionar Categoría..."
              onCreateNew={handleCategoryChange}
              disabled={!selectedTopic || !canEditDirect}
            />
            {errors.categoryName && (
              <span className="text-error text-xs mt-1 block">{errors.categoryName.message}</span>
            )}
          </div>
        </div>

        {/* ANVERSO (Front) */}
        <MarkdownEditor
          label="Anverso (Pregunta / Concepto) *"
          registration={register('front')}
          value={frontValue}
          placeholder="Ej. ### ¿Cómo funciona un closure en JavaScript?"
          rows={3}
          error={errors.front?.message}
          previewMinHeight="min-h-[90px]"
        />

        {/* REVERSO (Back) */}
        <MarkdownEditor
          label="Reverso (Respuesta / Explicación / Código) *"
          registration={register('back')}
          value={backValue}
          placeholder="Ej. Un closure es una función que recuerda su ámbito léxico...\n\n```javascript\nfunction makeCounter() {\n  let count = 0;\n  return () => ++count;\n}\n```"
          rows={5}
          error={errors.back?.message}
          previewMinHeight="min-h-[140px]"
        />

        <div className="flex gap-3 justify-end mt-2">
          <button
            type="button"
            onClick={onClose}
            className="py-3 px-6 font-bold rounded-xl bg-background hover:bg-background/80 transition-colors text-sm"
          >
            Cancelar
          </button>
          <button
            disabled={isSubmitting}
            type="submit"
            className="py-3 px-8 font-bold rounded-xl bg-primary text-white shadow-lg shadow-primary/30 hover:scale-105 transition-transform disabled:opacity-50 flex items-center gap-2 text-sm"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : canEditDirect ? (
              <Edit3 className="w-4 h-4" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {canEditDirect ? 'Guardar Cambios' : 'Enviar Sugerencia'}
          </button>
        </div>
      </form>
    </AdaptiveSheet>
  );
};
