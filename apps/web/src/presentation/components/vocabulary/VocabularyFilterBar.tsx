import React from 'react';
import { Search, X, Filter } from 'lucide-react';

interface VocabularyFilterBarProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  onlyMyDeck: boolean;
  setOnlyMyDeck: (val: boolean) => void;
  availableCategories: string[];
}

export const VocabularyFilterBar: React.FC<VocabularyFilterBarProps> = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  onlyMyDeck,
  setOnlyMyDeck,
  availableCategories,
}) => {
  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 relative z-10">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por palabra o traducción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-background border border-foreground/10 rounded-2xl pl-12 pr-4 py-3.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-semibold"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="relative md:w-64">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 w-5 h-5" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-background border border-foreground/10 rounded-2xl pl-12 pr-10 py-3.5 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none font-semibold cursor-pointer"
          >
            <option value="">Todas las categorías</option>
            {availableCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide relative z-10">
        <button
          onClick={() => setOnlyMyDeck(false)}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
            !onlyMyDeck
              ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105'
              : 'bg-background border border-foreground/10 hover:border-primary/30 text-foreground/70'
          }`}
        >
          Diccionario Global
        </button>
        <button
          onClick={() => setOnlyMyDeck(true)}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
            onlyMyDeck
              ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105'
              : 'bg-background border border-foreground/10 hover:border-primary/30 text-foreground/70'
          }`}
        >
          Mi Mazo (Guardadas)
        </button>
      </div>
    </>
  );
};
