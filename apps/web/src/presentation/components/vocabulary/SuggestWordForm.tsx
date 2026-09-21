import React from 'react';
import { Loader2, Lock, Unlock } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreatableCombobox } from '@/components/ui/CreatableCombobox';
import type { UseFormReturn } from 'react-hook-form';
import type { WordFormValues } from './schemas/wordSchema';

interface SuggestWordFormProps {
  form: UseFormReturn<WordFormValues>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isSubmitting: boolean;
  availableCategories: string[];
  setAvailableCategories: React.Dispatch<React.SetStateAction<string[]>>;
  onCancel: () => void;
}

export const SuggestWordForm: React.FC<SuggestWordFormProps> = ({
  form,
  onSubmit,
  isSubmitting,
  availableCategories,
  setAvailableCategories,
  onCancel,
}) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 mt-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold opacity-70 ml-2">Palabra (Inglés) *</label>
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
          <label className="text-xs font-bold opacity-70 ml-2">Traducción *</label>
          <input
            {...register('spanishTranslation')}
            className={`w-full mt-1 bg-background border-2 focus:border-primary rounded-xl px-4 py-3 font-semibold outline-none transition-colors ${
              errors.spanishTranslation ? 'border-error' : 'border-transparent'
            }`}
            placeholder="Ej. Resiliencia"
          />
          {errors.spanishTranslation && (
            <span className="text-error text-xs ml-2 mt-1 block font-semibold">
              {errors.spanishTranslation.message}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold opacity-70 ml-2">Nivel *</label>
          <div className="mt-1">
            <Select
              value={watch('level')}
              onValueChange={(val) => setValue('level', val as "A1" | "A2" | "B1" | "B2" | "C1" | "C2", { shouldValidate: true })}
            >
              <SelectTrigger className="h-12 w-full bg-background border border-foreground/10 rounded-xl px-4 font-semibold text-sm">
                <SelectValue placeholder="Selecciona un nivel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A1">A1 (Básico)</SelectItem>
                <SelectItem value="A2">A2 (Básico)</SelectItem>
                <SelectItem value="B1">B1 (Intermedio)</SelectItem>
                <SelectItem value="B2">B2 (Intermedio)</SelectItem>
                <SelectItem value="C1">C1 (Avanzado)</SelectItem>
                <SelectItem value="C2">C2 (Nativo)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {errors.level && (
            <span className="text-error text-xs ml-2 mt-1 block font-semibold">{errors.level.message}</span>
          )}
        </div>
        <div>
          <label className="text-xs font-bold opacity-70 ml-2">Categoría *</label>
          <div className="mt-1">
            <CreatableCombobox
              options={availableCategories.map((c) => ({ value: c, label: c }))}
              value={watch('category')}
              onChange={(val) => setValue('category', val, { shouldValidate: true })}
              onCreateNew={(newCategory) => {
                const normalized = newCategory
                  .trim()
                  .split(/\s+/)
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
                  .join(' ');
                if (!availableCategories.includes(normalized)) {
                  setAvailableCategories((prev) => [...prev, normalized].sort());
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

      {/* PRIVACIDAD */}
      <div className="flex items-center gap-3 p-4 bg-background/60 rounded-2xl border border-primary/10 mt-2">
        <button
          type="button"
          onClick={() => setValue('isPrivate', !watch('isPrivate'))}
          className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${
            watch('isPrivate') ? 'bg-primary' : 'bg-gray-400'
          }`}
        >
          <div
            className={`w-4 h-4 bg-white rounded-full absolute transition-transform ${
              watch('isPrivate') ? 'translate-x-7' : 'translate-x-1'
            }`}
          />
        </button>
        <div className="flex flex-col">
          <span className="text-sm font-bold flex items-center gap-2">
            {watch('isPrivate') ? (
              <>
                <Lock className="w-4 h-4 text-primary" /> Palabra Privada
              </>
            ) : (
              <>
                <Unlock className="w-4 h-4" /> Palabra Pública
              </>
            )}
          </span>
          <span className="text-xs opacity-70">
            {watch('isPrivate')
              ? 'Solo tú podrás ver y estudiar esta palabra en tu diccionario personal.'
              : 'Se enviará para revisión. Una vez aprobada, todos podrán verla.'}
          </span>
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 font-bold rounded-xl bg-background hover:bg-background/80 transition-colors text-sm"
        >
          Cancelar
        </button>
        <button
          disabled={isSubmitting}
          type="submit"
          className="flex-1 flex justify-center py-3 font-bold rounded-xl bg-primary text-white shadow-lg shadow-primary/30 hover:scale-105 transition-transform disabled:opacity-50 text-sm"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enviar Sugerencia'}
        </button>
      </div>
    </form>
  );
};
