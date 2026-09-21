import React from 'react';
import { Layers, Filter, Search, X, RotateCcw, Plus, BookOpen, Sparkles, Loader2, Play } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Group } from '../../../domain/models/flashcard';

interface FlashcardFilterBarProps {
  total: number;
  taxonomies: Group[];
  availableTopics: Array<{ id: string; name: string; categories: Record<string, unknown>[] }>;
  availableCategories: Array<{ id: string; name: string }>;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  selectedGroupId: string;
  setSelectedGroupId: (val: string) => void;
  selectedTopicId: string;
  setSelectedTopicId: (val: string) => void;
  selectedCategoryId: string;
  setSelectedCategoryId: (val: string) => void;
  onlyMyDeck: boolean;
  setOnlyMyDeck: (val: boolean) => void;
  hasActiveFilters: boolean;
  activeFiltersCount: number;
  handleClearFilters: () => void;
  onOpenCreateModal: () => void;
  startStudySession: () => void;
  isPreparingStudy: boolean;
  cardsLength: number;
}

export const FlashcardFilterBar: React.FC<FlashcardFilterBarProps> = ({
  total,
  taxonomies,
  availableTopics,
  availableCategories,
  searchTerm,
  setSearchTerm,
  selectedGroupId,
  setSelectedGroupId,
  selectedTopicId,
  setSelectedTopicId,
  selectedCategoryId,
  setSelectedCategoryId,
  onlyMyDeck,
  setOnlyMyDeck,
  hasActiveFilters,
  activeFiltersCount,
  handleClearFilters,
  onOpenCreateModal,
  startStudySession,
  isPreparingStudy,
  cardsLength,
}) => {
  return (
    <div className="glass-panel p-6 md:p-8 rounded-3xl mb-10 shadow-lg shadow-black/5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-black text-foreground flex items-center gap-2 tracking-tight">
            <BookOpen className="w-8 h-8 text-primary" /> Mazo de Flashcards
          </h2>
          <p className="text-sm opacity-70 mt-1">
            {total > 0 ? (
              <>
                {onlyMyDeck ? 'Tienes ' : 'Existen '}
                <strong className="text-primary">{total}</strong> tarjetas disponibles
              </>
            ) : (
              'Explora y aprende con tarjetas de estudio activo.'
            )}
          </p>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="w-full sm:w-auto bg-card hover:bg-muted/70 text-foreground border border-border/80 font-bold px-5 py-2.5 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm text-sm"
        >
          <Plus className="w-4 h-4 text-primary" /> Crear Tarjeta
        </button>
      </div>

      {/* ROW 1: BÚSQUEDA + LIMPIAR FILTROS + TABS */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 relative z-10">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por anverso o reverso..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-background border border-foreground/10 rounded-2xl pl-12 pr-10 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-medium text-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground p-1"
              aria-label="Borrar búsqueda"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* BOTÓN LIMPIAR FILTROS */}
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/20 text-xs font-bold transition-all shrink-0 active:scale-95 animate-in fade-in zoom-in-95 duration-150"
            title="Restablecer todos los filtros"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Limpiar filtros</span>
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-destructive text-white text-[10px] font-black">
              {activeFiltersCount}
            </span>
          </button>
        )}

        {/* TABS MI MAZO / PÚBLICAS */}
        <div className="flex bg-foreground/5 p-1 rounded-2xl shrink-0 self-stretch md:self-auto">
          <button
            onClick={() => setOnlyMyDeck(false)}
            className={`flex-1 md:flex-initial px-4 py-2 font-bold text-xs rounded-xl transition-all ${
              !onlyMyDeck ? 'bg-primary text-white shadow-sm' : 'opacity-60 hover:opacity-100'
            }`}
          >
            Públicas
          </button>
          <button
            onClick={() => setOnlyMyDeck(true)}
            className={`flex-1 md:flex-initial px-4 py-2 font-bold text-xs rounded-xl transition-all ${
              onlyMyDeck ? 'bg-primary text-white shadow-sm' : 'opacity-60 hover:opacity-100'
            }`}
          >
            Mi Mazo
          </button>
        </div>
      </div>

      {/* ROW 2: TAXONOMÍAS EN REJILLA RESPONSIVA */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 relative z-10">
        {/* Grupo */}
        <Select
          value={selectedGroupId || 'all'}
          onValueChange={(val) => {
            setSelectedGroupId(val === 'all' ? '' : val);
            setSelectedTopicId('');
            setSelectedCategoryId('');
          }}
        >
          <SelectTrigger className="h-11 w-full bg-background border border-foreground/10 rounded-2xl px-3.5 font-semibold text-xs">
            <div className="flex items-center gap-2 truncate">
              <Layers className="w-4 h-4 text-primary shrink-0" />
              <SelectValue placeholder="Todos los Grupos" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los Grupos</SelectItem>
            {taxonomies.map((g) => (
              <SelectItem key={g.id} value={g.id}>
                {g.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Tema */}
        <Select
          value={selectedTopicId || 'all'}
          onValueChange={(val) => {
            setSelectedTopicId(val === 'all' ? '' : val);
            setSelectedCategoryId('');
          }}
          disabled={!selectedGroupId}
        >
          <SelectTrigger className="h-11 w-full bg-background border border-foreground/10 rounded-2xl px-3.5 font-semibold text-xs disabled:opacity-50">
            <div className="flex items-center gap-2 truncate">
              <Layers className="w-4 h-4 text-primary shrink-0" />
              <SelectValue placeholder="Todos los Temas" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los Temas</SelectItem>
            {availableTopics.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Categoría */}
        <Select
          value={selectedCategoryId || 'all'}
          onValueChange={(val) => {
            setSelectedCategoryId(val === 'all' ? '' : val);
          }}
          disabled={!selectedTopicId}
        >
          <SelectTrigger className="h-11 w-full bg-background border border-foreground/10 rounded-2xl px-3.5 font-semibold text-xs disabled:opacity-50">
            <div className="flex items-center gap-2 truncate">
              <Filter className="w-4 h-4 text-primary shrink-0" />
              <SelectValue placeholder="Todas las Categorías" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las Categorías</SelectItem>
            {availableCategories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* ROW 3: BARRA DE ACCIÓN: MODO ESTUDIO */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-5 pt-5 border-t border-foreground/5">
        <div className="flex items-center gap-2 text-sm opacity-70">
          <Sparkles className="w-4 h-4 text-primary" />
          <span>
            {cardsLength > 0
              ? `${cardsLength} tarjetas listas para repasar con Repetición Espaciada (SRS)`
              : 'No hay tarjetas disponibles para estudiar con los filtros actuales'}
          </span>
        </div>

        <button
          disabled={cardsLength === 0 || isPreparingStudy}
          onClick={startStudySession}
          className="w-full sm:w-auto bg-primary text-white font-black uppercase tracking-wider px-7 py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-transform active:scale-95 shadow-md shadow-primary/20 disabled:opacity-50 disabled:pointer-events-none"
        >
          {isPreparingStudy ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Play className="w-5 h-5 fill-current" />
          )}
          {isPreparingStudy ? 'Preparando...' : `Estudiar Mazo (${cardsLength})`}
        </button>
      </div>
    </div>
  );
};
