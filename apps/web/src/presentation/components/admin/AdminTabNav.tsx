import React from 'react';
import { ShieldAlert, BookOpen, KeyRound } from 'lucide-react';

interface AdminTabNavProps {
  activeTab: 'words' | 'flashcards' | 'invites';
  setActiveTab: (tab: 'words' | 'flashcards' | 'invites') => void;
  pendingWordsCount: number;
  pendingCardsCount: number;
}

export const AdminTabNav: React.FC<AdminTabNavProps> = ({
  activeTab,
  setActiveTab,
  pendingWordsCount,
  pendingCardsCount,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-10">
      <button
        onClick={() => setActiveTab('words')}
        className={`flex-1 py-4 font-bold rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 ${
          activeTab === 'words'
            ? 'bg-primary text-white shadow-[0_4px_20px_rgba(244,63,94,0.4)] scale-105 border-transparent'
            : 'bg-card text-foreground hover:bg-primary/10 border-2 border-primary/5 opacity-70'
        }`}
      >
        <ShieldAlert className="w-5 h-5" /> Palabras ({pendingWordsCount})
      </button>

      <button
        onClick={() => setActiveTab('flashcards')}
        className={`flex-1 py-4 font-bold rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 ${
          activeTab === 'flashcards'
            ? 'bg-primary text-white shadow-[0_4px_20px_rgba(244,63,94,0.4)] scale-105 border-transparent'
            : 'bg-card text-foreground hover:bg-primary/10 border-2 border-primary/5 opacity-70'
        }`}
      >
        <BookOpen className="w-5 h-5" /> Flashcards ({pendingCardsCount})
      </button>

      <button
        onClick={() => setActiveTab('invites')}
        className={`flex-1 py-4 font-bold rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 ${
          activeTab === 'invites'
            ? 'bg-primary text-white shadow-[0_4px_20px_rgba(244,63,94,0.4)] scale-105 border-transparent'
            : 'bg-card text-foreground hover:bg-primary/10 border-2 border-primary/5 opacity-70'
        }`}
      >
        <KeyRound className="w-5 h-5" /> Invitaciones Admin
      </button>
    </div>
  );
};
