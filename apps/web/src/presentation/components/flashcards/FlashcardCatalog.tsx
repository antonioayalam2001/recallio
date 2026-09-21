import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { BookOpen, Loader2 } from 'lucide-react';
import { FlashcardDeck } from './FlashcardDeck';
import { CreateFlashcardModal } from './CreateFlashcardModal';
import { EditFlashcardModal } from './EditFlashcardModal';
import { useFlashcards } from '../../../application/useFlashcards';
import { FlashcardItem } from './FlashcardItem';
import { FlashcardFilterBar } from './FlashcardFilterBar';
import { DeleteFlashcardDialog } from './DeleteFlashcardDialog';
import { useFlashcardFilters } from './hooks/useFlashcardFilters';
import type { Flashcard } from '../../../domain/models/flashcard';

export const FlashcardCatalog: React.FC = () => {
  const {
    taxonomies,
    flashcards: cards,
    isLoading,
    total,
    currentUserId,
    currentUserRole,
    loadTaxonomies,
    fetchFlashcards,
    toggleSave,
    deleteFlashcard,
  } = useFlashcards();

  const {
    searchTerm,
    setSearchTerm,
    debouncedSearch,
    selectedGroupId,
    setSelectedGroupId,
    selectedTopicId,
    setSelectedTopicId,
    selectedCategoryId,
    setSelectedCategoryId,
    onlyMyDeck,
    setOnlyMyDeck,
    isStudying,
    setIsStudying,
    studyCards,
    isPreparingStudy,
    startStudySession,
    hasActiveFilters,
    activeFiltersCount,
    handleClearFilters,
  } = useFlashcardFilters({ fetchFlashcards });

  const [cardToDelete, setCardToDelete] = useState<string | null>(null);
  const [cardToEdit, setCardToEdit] = useState<Flashcard | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadTaxonomies();
  }, [loadTaxonomies]);

  const currentGroup = taxonomies.find((g) => g.id === selectedGroupId);
  const availableTopics = currentGroup ? currentGroup.topics : [];
  const currentTopic = availableTopics.find((t) => t.id === selectedTopicId);
  const availableCategories = currentTopic ? currentTopic.categories : [];

  if (isStudying) {
    return (
      <FlashcardDeck
        cards={studyCards}
        topicTitle={currentTopic?.name}
        categoryTitle={availableCategories.find((c) => c.id === selectedCategoryId)?.name}
        onExit={() => setIsStudying(false)}
      />
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto relative pb-24">
      {/* HEADER DE BÚSQUEDA Y FILTROS */}
      <FlashcardFilterBar
        total={total}
        taxonomies={taxonomies}
        availableTopics={availableTopics}
        availableCategories={availableCategories}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedGroupId={selectedGroupId}
        setSelectedGroupId={setSelectedGroupId}
        selectedTopicId={selectedTopicId}
        setSelectedTopicId={setSelectedTopicId}
        selectedCategoryId={selectedCategoryId}
        setSelectedCategoryId={setSelectedCategoryId}
        onlyMyDeck={onlyMyDeck}
        setOnlyMyDeck={setOnlyMyDeck}
        hasActiveFilters={hasActiveFilters}
        activeFiltersCount={activeFiltersCount}
        handleClearFilters={handleClearFilters}
        onOpenCreateModal={() => setIsModalOpen(true)}
        startStudySession={startStudySession}
        isPreparingStudy={isPreparingStudy}
        cardsLength={cards.length}
      />

      {/* REJILLA DE TARJETAS */}
      {isLoading && cards.length === 0 ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      ) : !isLoading && cards.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <BookOpen className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-2">No se encontraron flashcards</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            {searchTerm || selectedGroupId || selectedTopicId || selectedCategoryId
              ? 'Prueba ajustando los filtros de búsqueda o taxonomía.'
              : 'Aún no hay flashcards registradas. ¡Sé el primero en crear una!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {cards.map((card) => (
              <FlashcardItem
                key={card.id}
                card={card}
                toggleSave={toggleSave}
                currentUserId={currentUserId || undefined}
                currentUserRole={currentUserRole || undefined}
                onEdit={(c) => {
                  setCardToEdit(c);
                  setIsEditModalOpen(true);
                }}
                onDelete={setCardToDelete}
                onlyMyDeck={onlyMyDeck}
                onRemoveFromDeck={() => {
                  setTimeout(() => {
                    fetchFlashcards(
                      1,
                      debouncedSearch,
                      selectedGroupId,
                      selectedTopicId,
                      selectedCategoryId,
                      true,
                      onlyMyDeck
                    );
                  }, 500);
                }}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* MODAL CREAR TARJETA */}
      <CreateFlashcardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        taxonomies={taxonomies}
        onCreated={() =>
          fetchFlashcards(
            1,
            debouncedSearch,
            selectedGroupId,
            selectedTopicId,
            selectedCategoryId,
            true,
            onlyMyDeck
          )
        }
      />

      {/* MODAL EDITAR / SUGERIR TARJETA */}
      <EditFlashcardModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setCardToEdit(null);
        }}
        taxonomies={taxonomies}
        card={cardToEdit}
        isAdmin={currentUserRole === 'ADMIN'}
        isPrivateCard={
          cardToEdit
            ? ((cardToEdit as Record<string, string>).createdById === currentUserId &&
                (cardToEdit.status as string) === 'PRIVATE')
            : false
        }
        onUpdated={() =>
          fetchFlashcards(
            1,
            debouncedSearch,
            selectedGroupId,
            selectedTopicId,
            selectedCategoryId,
            true,
            onlyMyDeck
          )
        }
      />

      {/* DIÁLOGO DE BORRADO */}
      <DeleteFlashcardDialog
        cardToDelete={cardToDelete}
        onClose={() => setCardToDelete(null)}
        cards={cards}
        currentUserRole={currentUserRole || undefined}
        onConfirmDelete={async (id) => {
          await deleteFlashcard(id);
        }}
      />
    </div>
  );
};
