import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Edit3, Sparkles, Loader2, Send, ShieldAlert } from 'lucide-react';
import { useVocabulary } from '../../../application/useVocabulary';
import { AdaptiveSheet } from '../ui/AdaptiveSheet';
import { CreatableCombobox } from '@/components/ui/CreatableCombobox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Word } from '../../../domain/models/vocabulary';

const wordEditSchema = z.object({
  englishWord: z.string().min(1, 'La palabra en inglés es requerida'),
  spanishTranslation: z.string().min(1, 'La traducción es requerida'),
  level: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']),
  category: z.string().min(1, 'La categoría es requerida'),
  exampleSentence: z.string().optional(),
  exampleTranslation: z.string().optional(),
});

type WordEditFormValues = z.infer<typeof wordEditSchema>;

interface EditWordModalProps {
  isOpen: boolean;
  onClose: () => void;
  word: Word | undefined;
  isPrivateWord: boolean;
  isAdmin?: boolean;
  availableCategories: string[];
  onUpdated: () => void;
}

export const EditWordModal: React.FC<EditWordModalProps> = ({
  isOpen,
  onClose,
  word,
  isPrivateWord,
  isAdmin = false,
  availableCategories,
  onUpdated,
}) => {
  const { updateWord, suggestWordEdit } = useVocabulary();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoriesList, setCategoriesList] = useState<string[]>(availableCategories);

  useEffect(() => {
    setCategoriesList(availableCategories);
  }, [availableCategories]);

  const canEditDirect = isPrivateWord || isAdmin;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<WordEditFormValues>({
    resolver: zodResolver(wordEditSchema),
    defaultValues: {
      englishWord: '',
      spanishTranslation: '',
      level: 'A1',
      category: '',
      exampleSentence: '',
      exampleTranslation: '',
    },
  });

  useEffect(() => {
    if (word && isOpen) {
      reset({
        englishWord: word.englishWord || '',
        spanishTranslation: word.spanishTranslation || '',
        level: (word.level as "A1" | "A2" | "B1" | "B2" | "C1" | "C2") || 'A1',
        category: word.category || '',
        exampleSentence: word.exampleSentence || '',
        exampleTranslation: word.exampleTranslation || '',
      });
    }
  }, [word, isOpen, reset]);

  const onSubmit = async (data: WordEditFormValues) => {
    if (!word) return;
    setIsSubmitting(true);

    if (canEditDirect) {
      // Edición directa (autor privado o admin)
      await updateWord(word.id, data as Record<string, unknown>, () => {
        onUpdated();
        onClose();
      });
    } else {
      // Sugerencia de cambio a moderación para palabra pública (vinculada con originalWordId)
      await suggestWordEdit(
        {
          ...data,
          exampleSentence: data.exampleSentence,
          exampleTranslation: data.exampleTranslation,
          originalWordId: word.id,
          isPrivate: false,
        } as Record<string, unknown>,
        () => {
          onUpdated();
          onClose();
        }
      );
    }
    setIsSubmitting(false);
  };

  return (
    <AdaptiveSheet
      isOpen={isOpen}
      onClose={onClose}
      title={
        <span className="flex items-center gap-2">
          {canEditDirect ? (
            <>
              <Edit3 className="w-6 h-6 text-primary" /> Editar Palabra {isPrivateWord ? 'Privada' : 'Pública'}
            </>
          ) : (
            <>
              <Sparkles className="w-6 h-6 text-primary" /> Sugerir Mejora en Palabra Pública
            </>
          )}
        </span>
      }
      description={
        canEditDirect
          ? 'Modifica los detalles de la palabra. Los cambios se guardarán de inmediato.'
          : 'Propón una corrección para esta palabra pública. Será revisada por un administrador.'
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4 mt-2">
        {!canEditDirect && (
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-start gap-3 text-xs text-foreground/80">
            <ShieldAlert className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-foreground">Revisión requerida</p>
              <p className="opacity-80">
                Al enviar esta corrección, entrará en la cola de moderación del administrador. Una vez aprobada, se actualizará en el catálogo público.
              </p>
            </div>
          </div>
        )}

        <div>
          <label className="text-xs font-bold opacity-70 ml-2">Palabra en Inglés *</label>
          <input
            {...register('englishWord')}
            className={`w-full mt-1 bg-background border-2 focus:border-primary rounded-xl px-4 py-3 font-semibold outline-none transition-colors ${
              errors.englishWord ? 'border-error' : 'border-transparent'
            }`}
            placeholder="Ej. Resilience"
          />
          {errors.englishWord && (
            <span className="text-error text-xs ml-2 mt-1 block font-semibold">
              {errors.englishWord.message}
            </span>
          )}
        </div>

        <div>
          <label className="text-xs font-bold opacity-70 ml-2">Traducción en Español *</label>
          <input
            {...register('spanishTranslation')}
            className={`w-full mt-1 bg-background border-2 focus:border-primary rounded-xl px-4 py-3 font-semibold outline-none transition-colors ${
              errors.spanishTranslation ? 'border-error' : 'border-transparent'
            }`}
            placeholder="Ej. Capacidad de adaptación / Resiliencia"
          />
          {errors.spanishTranslation && (
            <span className="text-error text-xs ml-2 mt-1 block font-semibold">
              {errors.spanishTranslation.message}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold opacity-70 ml-2">Nivel (CEFR) *</label>
            <div className="mt-1">
              <Select
                // eslint-disable-next-line react-hooks/incompatible-library
                value={watch('level')}
                onValueChange={(val) => setValue('level', val as "A1" | "A2" | "B1" | "B2" | "C1" | "C2", { shouldValidate: true })}
              >
                <SelectTrigger className="h-12 w-full bg-background border border-foreground/10 rounded-xl px-4 font-semibold text-sm">
                  <SelectValue placeholder="Selecciona un nivel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A1">A1 (Principiante)</SelectItem>
                  <SelectItem value="A2">A2 (Básico)</SelectItem>
                  <SelectItem value="B1">B1 (Intermedio Bajo)</SelectItem>
                  <SelectItem value="B2">B2 (Intermedio)</SelectItem>
                  <SelectItem value="C1">C1 (Avanzado)</SelectItem>
                  <SelectItem value="C2">C2 (Nativo)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {errors.level && (
              <span className="text-error text-xs ml-2 mt-1 block font-semibold">
                {errors.level.message}
              </span>
            )}
          </div>
          <div>
            <label className="text-xs font-bold opacity-70 ml-2">Categoría *</label>
            <div className="mt-1">
              <CreatableCombobox
                options={categoriesList.map((c) => ({ value: c, label: c }))}
                value={watch('category')}
                onChange={(val) => setValue('category', val, { shouldValidate: true })}
                onCreateNew={(newCategory) => {
                  const normalized = newCategory
                    .trim()
                    .split(/\s+/)
                    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
                    .join(' ');
                  if (!categoriesList.includes(normalized)) {
                    setCategoriesList((prev) => [...prev, normalized].sort());
                  }
                  setValue('category', normalized, { shouldValidate: true });
                }}
                placeholder="Selecciona o crea categoría..."
                emptyText="No se encontraron categorías"
                className="h-12 w-full bg-background border border-foreground/10 rounded-xl px-4 font-semibold text-sm"
              />
            </div>
            {errors.category && (
              <span className="text-error text-xs ml-2 mt-1 block font-semibold">
                {errors.category.message}
              </span>
            )}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold opacity-70 ml-2">Oración de Ejemplo (Inglés)</label>
          <input
            {...register('exampleSentence')}
            className="w-full mt-1 bg-background border-2 border-transparent focus:border-primary rounded-xl px-4 py-3 font-semibold outline-none transition-colors"
            placeholder="Her resilience helped her overcome the crisis."
          />
        </div>

        <div>
          <label className="text-xs font-bold opacity-70 ml-2">Traducción de Ejemplo</label>
          <input
            {...register('exampleTranslation')}
            className="w-full mt-1 bg-background border-2 border-transparent focus:border-primary rounded-xl px-4 py-3 font-semibold outline-none transition-colors"
            placeholder="Su resiliencia le ayudó a superar la crisis."
          />
        </div>

        <div className="flex gap-3 justify-end mt-4">
          <button
            type="button"
            onClick={onClose}
            className="py-3 px-6 font-bold rounded-xl bg-background hover:bg-background/80 transition-colors text-sm"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="py-3 px-6 font-bold rounded-xl bg-primary text-white shadow-lg shadow-primary/30 hover:scale-105 transition-transform text-sm flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isPrivateWord ? (
              'Guardar Cambios'
            ) : (
              <>
                <Send className="w-4 h-4" /> Enviar Sugerencia
              </>
            )}
          </button>
        </div>
      </form>
    </AdaptiveSheet>
  );
};
