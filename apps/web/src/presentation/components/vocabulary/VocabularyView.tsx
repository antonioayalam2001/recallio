import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Plus, BookOpen, Search } from 'lucide-react';
import { useVocabulary } from '../../../application/useVocabulary';
import { AdaptiveSheet } from '../ui/AdaptiveSheet';
import { EditWordModal } from './EditWordModal';
import { VocabularyFilterBar } from './VocabularyFilterBar';
import { VocabularyWordCard } from './VocabularyWordCard';
import { VocabularyCardSkeleton } from './VocabularyCardSkeleton';
import { SuggestWordForm } from './SuggestWordForm';
import { DeleteWordDialog } from './DeleteWordDialog';
import { useVocabularyFilters } from './hooks/useVocabularyFilters';
import { useSuggestWordForm } from './hooks/useSuggestWordForm';
import type { Word } from '../../../domain/models/vocabulary';

/**
 * Catálogo moderno de vocabulario con paginación infinita, búsqueda
 * en backend, filtros, y gestión (crear/editar/borrar/bookmark).
 *
 * Refactorizado en componentes atómicos y hooks (V1-V10).
 */
export const VocabularyView: React.FC = () => {
  const {
    words,
    isLoading,
    isSubmitting,
    hasMore,
    page,
    total,
    setPage,
    fetchWords,
    suggestWord,
    toggleSave,
    currentUserId,
    currentUserRole,
    deleteWord,
  } = useVocabulary();

  // 1. Hook de filtros y estado base
  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    onlyMyDeck,
    setOnlyMyDeck,
    availableCategories,
    setAvailableCategories,
    refetch,
  } = useVocabularyFilters({ fetchWords, setPage, page });

  // 2. Modales & Tooling states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [wordToEdit, setWordToEdit] = useState<Word | undefined>(undefined);
  const [wordToDelete, setWordToDelete] = useState<string | undefined>(undefined);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());

  // 3. Hook para formulario de sugerencia
  const { form, onSubmit } = useSuggestWordForm({
    suggestWord,
    onSuccess: () => setIsModalOpen(false),
  });

  // 4. Infinite Scroll Sentinel
  const sentinelRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!hasMore || isLoading || words.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((p) => p + 1);
        }
      },
      { threshold: 0.1 }
    );
    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, isLoading, words.length, setPage]);

  // Audio helper
  const speakWord = (word: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const handleToggleSave = async (wordId: string) => {
    const isSaved = await toggleSave(wordId);

    if (isSaved) {
      setBookmarkedIds((prev) => new Set(prev).add(wordId));
      setRemovedIds((prev) => {
        const next = new Set(prev);
        next.delete(wordId);
        return next;
      });
    } else {
      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        next.delete(wordId);
        return next;
      });
      setRemovedIds((prev) => new Set(prev).add(wordId));
    }

    if (onlyMyDeck && !isSaved) {
      // Remover visualmente tras una pausa
      setTimeout(() => refetch(), 500);
    }
  };

  const isLoadingMore = isLoading && page > 1;

  return (
    <div className="w-full max-w-6xl mx-auto relative pb-24">
      {/* HEADER & FILTROS */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl mb-10 shadow-lg shadow-black/5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-black text-foreground flex items-center gap-2 tracking-tight">
              <BookOpen className="w-8 h-8 text-primary" /> Diccionario de Vocabulario
            </h2>
            <p className="text-sm opacity-70 mt-1">
              {total > 0 ? (
                <>
                  {onlyMyDeck ? 'Tienes ' : 'Existen '}
                  <strong className="text-primary">{total}</strong> palabras en total
                </>
              ) : (
                'Explora y aprende nuevas palabras en inglés.'
              )}
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full md:w-auto bg-primary text-white font-black uppercase tracking-wider px-6 py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-transform active:scale-95 shadow-md shadow-primary/20"
          >
            <Plus className="w-5 h-5" /> Añadir Palabra
          </button>
        </div>

        <VocabularyFilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          onlyMyDeck={onlyMyDeck}
          setOnlyMyDeck={setOnlyMyDeck}
          availableCategories={availableCategories}
        />
      </div>

      {/* GRID DE RESULTADOS */}
      {!isLoading && words.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 bg-foreground/5 rounded-full flex items-center justify-center mb-6">
            <Search className="w-10 h-10 opacity-30" />
          </div>
          <h3 className="text-2xl font-black mb-2 tracking-tight">No se encontraron palabras</h3>
          <p className="opacity-60 font-medium max-w-md">
            Intenta cambiar los filtros o el término de búsqueda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {words.map((word) => {
              const isBookmarked =
                (word.isSaved && !removedIds.has(word.id)) || bookmarkedIds.has(word.id);

              return (
                <VocabularyWordCard
                  key={word.id}
                  word={word}
                  currentUserId={currentUserId}
                  currentUserRole={currentUserRole}
                  isBookmarked={isBookmarked}
                  onEdit={() => {
                    setWordToEdit(word);
                    setIsEditModalOpen(true);
                  }}
                  onToggleSave={() => handleToggleSave(word.id)}
                  onDelete={() => setWordToDelete(word.id)}
                  speakWord={speakWord}
                />
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* SKELETONS AL CARGAR MÁS */}
      {isLoadingMore && <VocabularyCardSkeleton count={3} />}

      {/* CENTINELA DE INTERSECTION OBSERVER */}
      <div ref={sentinelRef} className="h-10 w-full flex items-center justify-center mt-6">
        {!hasMore && words.length > 0 && (
          <p className="text-xs font-bold opacity-40 uppercase tracking-widest">
            Has llegado al final del catálogo ({words.length} palabras)
          </p>
        )}
      </div>

      {/* MODAL DE SUGERENCIA DE PALABRA NUEVA */}
      <AdaptiveSheet
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          form.reset();
        }}
        title="Sugerir Nueva Palabra"
        description="Las palabras sugeridas serán revisadas por un administrador antes de aparecer en el juego y diccionario."
        maxWidth="max-w-lg"
      >
        <SuggestWordForm
          form={form}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          availableCategories={availableCategories}
          setAvailableCategories={setAvailableCategories}
          onCancel={() => {
            setIsModalOpen(false);
            form.reset();
          }}
        />
      </AdaptiveSheet>

      {/* MODAL DE EDICIÓN */}
      <EditWordModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setWordToEdit(undefined);
        }}
        word={wordToEdit}
        isPrivateWord={
          wordToEdit ? wordToEdit.createdById === currentUserId && (wordToEdit.status as string) === 'PRIVATE' : false
        }
        isAdmin={currentUserRole === 'ADMIN'}
        availableCategories={availableCategories}
        onUpdated={() => refetch()}
      />

      {/* DIÁLOGO DE BORRADO */}
      <DeleteWordDialog
        wordToDelete={wordToDelete}
        onClose={() => setWordToDelete(undefined)}
        words={words}
        currentUserRole={currentUserRole}
        onConfirmDelete={async (id) => { await deleteWord(id); }}
      />
    </div>
  );
};
