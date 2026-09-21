import React from 'react';
import { Loader2, Sparkles, Lock, Unlock } from 'lucide-react';
import { useFlashcards } from '../../../application/useFlashcards';
import { AdaptiveSheet } from '../ui/AdaptiveSheet';
import { CreatableCombobox } from '@/components/ui/CreatableCombobox';
import { MarkdownEditor } from '../ui/MarkdownEditor';
import { useCreateFlashcardForm } from './hooks/useCreateFlashcardForm';
import type { Group } from '../../../domain/models/flashcard';

interface CreateFlashcardModalProps {
  isOpen: boolean;
  onClose: () => void;
  taxonomies: Group[];
  onCreated: () => void;
}

export const CreateFlashcardModal: React.FC<CreateFlashcardModalProps> = ({
  isOpen,
  onClose,
  taxonomies,
  onCreated,
}) => {
  const { createFlashcard } = useFlashcards();

  const {
    form: { register, handleSubmit, errors, setValue },
    values: { frontValue, backValue, selectedGroup, selectedTopic, selectedCategory, isPrivate },
    taxonomiesDerived: { availableTopics, availableCategories },
    handlers: { handleGroupChange, handleTopicChange, handleCategoryChange, onSubmit },
    isSubmitting,
    reset,
  } = useCreateFlashcardForm({
    taxonomies,
    createFlashcard,
    onCreated,
    onClose,
  });

  return (
    <AdaptiveSheet
      isOpen={isOpen}
      onClose={() => {
        reset();
        onClose();
      }}
      title={
        <span className="flex items-center gap-2">
          <Sparkles className="w-6 h-6" /> Crear Nueva Flashcard
        </span>
      }
      description="Admite Markdown y bloques de código (```ts, ```py, ```sql)."
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
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
              disabled={!selectedGroup}
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
              disabled={!selectedTopic}
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

        {/* PRIVACIDAD */}
        <div className="flex items-center gap-3 p-4 bg-background/60 rounded-2xl border border-primary/10">
          <button
            type="button"
            onClick={() => setValue('isPrivate', !isPrivate)}
            className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${
              isPrivate ? 'bg-primary' : 'bg-gray-400'
            }`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full absolute transition-transform ${
                isPrivate ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
          <div className="flex flex-col">
            <span className="text-sm font-bold flex items-center gap-2">
              {isPrivate ? (
                <>
                  <Lock className="w-4 h-4 text-primary" /> Flashcard Privada
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" /> Flashcard Pública
                </>
              )}
            </span>
            <span className="text-xs opacity-70">
              {isPrivate
                ? 'Solo tú podrás ver y estudiar esta tarjeta en tu mazo personal.'
                : 'Se enviará para revisión. Una vez aprobada, todos podrán verla.'}
            </span>
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-2">
          <button
            type="button"
            onClick={() => {
              reset();
              onClose();
            }}
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
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            Crear Tarjeta
          </button>
        </div>
      </form>
    </AdaptiveSheet>
  );
};
