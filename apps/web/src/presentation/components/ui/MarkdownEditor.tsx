import React, { useState } from 'react';
import { Eye, Edit3 } from 'lucide-react';
import { MarkdownContent } from '../flashcards/MarkdownContent';
import type { UseFormRegisterReturn } from 'react-hook-form';

interface MarkdownEditorProps {
  /** Etiqueta visible encima del editor */
  label: string;
  /** Resultado de `register('fieldName')` de react-hook-form */
  registration: UseFormRegisterReturn;
  /** Valor actual del campo (de `watch('fieldName')`) para la vista previa */
  value: string;
  /** Placeholder que se muestra en el textarea */
  placeholder?: string;
  /** Número de filas del textarea en modo escritura (default: 4) */
  rows?: number;
  /** Altura mínima del panel de previsualización (default: min-h-[100px]) */
  previewMinHeight?: string;
  /** Mensaje de error de validación (de `errors.fieldName?.message`) */
  error?: string;
}

/**
 * Editor de texto con soporte Markdown y tabs Write / Preview.
 * Extrae el patrón repetido entre CreateFlashcardModal y EditFlashcardModal.
 *
 * @component MarkdownEditor
 * @example
 * <MarkdownEditor
 *   label="Anverso (Pregunta / Concepto) *"
 *   registration={register('front')}
 *   value={watch('front')}
 *   placeholder="¿Cómo funciona un closure?"
 *   rows={3}
 *   error={errors.front?.message}
 * />
 */
export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  label,
  registration,
  value,
  placeholder,
  rows = 4,
  previewMinHeight = 'min-h-[100px]',
  error,
}) => {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  return (
    <div className="bg-background/60 p-4 rounded-2xl border border-primary/10">
      {/* Header: label + tab switcher */}
      <div className="flex justify-between items-center mb-2">
        <label className="text-xs font-bold opacity-80 uppercase tracking-wider">
          {label}
        </label>
        <div className="flex gap-1 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            className={`px-3 py-1 rounded-lg font-bold transition-colors ${
              activeTab === 'write' ? 'bg-primary text-white' : 'opacity-60 hover:opacity-100'
            }`}
            aria-pressed={activeTab === 'write'}
          >
            <Edit3 className="w-3.5 h-3.5 inline mr-1" />
            Editar
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1 rounded-lg font-bold transition-colors ${
              activeTab === 'preview' ? 'bg-primary text-white' : 'opacity-60 hover:opacity-100'
            }`}
            aria-pressed={activeTab === 'preview'}
          >
            <Eye className="w-3.5 h-3.5 inline mr-1" />
            Vista Previa
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'write' ? (
        <textarea
          {...registration}
          rows={rows}
          placeholder={placeholder}
          className="w-full bg-background border-2 border-transparent focus:border-primary rounded-xl p-3 font-mono text-sm outline-none resize-y transition-colors"
        />
      ) : (
        <div className={`p-4 bg-background rounded-xl ${previewMinHeight}`}>
          {value ? (
            <MarkdownContent content={value} />
          ) : (
            <span className="opacity-40 italic text-xs">Nada que previsualizar</span>
          )}
        </div>
      )}

      {/* Validation error */}
      {error && (
        <span className="text-error text-xs mt-1 block font-semibold">{error}</span>
      )}
    </div>
  );
};
