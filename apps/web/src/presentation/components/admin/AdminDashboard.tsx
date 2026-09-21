import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../../application/useAdmin';
import { AdminTabNav } from './AdminTabNav';
import { PendingWordsTab } from './PendingWordsTab';
import { PendingFlashcardsTab } from './PendingFlashcardsTab';
import { AdminInviteTab } from './AdminInviteTab';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'words' | 'flashcards' | 'invites'>('words');

  const {
    pendingWords,
    pendingCards,
    isLoadingWords,
    isLoadingCards,
    isActionLoading,
    generatedToken,
    fetchPendingWords,
    fetchPendingCards,
    moderateWord,
    moderateCard,
    generateInvite,
  } = useAdmin();

  useEffect(() => {
    fetchPendingWords();
    fetchPendingCards();
  }, [fetchPendingWords, fetchPendingCards]);

  return (
    <div className="w-full max-w-5xl mx-auto relative">
      {/* TABS SELECTOR */}
      <AdminTabNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingWordsCount={pendingWords.length}
        pendingCardsCount={pendingCards.length}
      />

      <div className="bg-card shadow-2xl border border-primary/10 rounded-3xl p-6 md:p-10 min-h-[400px]">
        {/* VIEW: MODERACIÓN DE PALABRAS */}
        {activeTab === 'words' && (
          <PendingWordsTab
            pendingWords={pendingWords}
            isLoadingWords={isLoadingWords}
            isActionLoading={isActionLoading}
            moderateWord={moderateWord}
          />
        )}

        {/* VIEW: MODERACIÓN DE FLASHCARDS */}
        {activeTab === 'flashcards' && (
          <PendingFlashcardsTab
            pendingCards={pendingCards}
            isLoadingCards={isLoadingCards}
            isActionLoading={isActionLoading}
            moderateCard={moderateCard}
          />
        )}

        {/* VIEW: INVITACIONES ADMIN */}
        {activeTab === 'invites' && (
          <AdminInviteTab
            isActionLoading={isActionLoading}
            generatedToken={generatedToken}
            generateInvite={generateInvite}
          />
        )}
      </div>
    </div>
  );
};
