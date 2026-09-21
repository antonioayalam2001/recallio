import React from 'react';

interface VocabularyCardSkeletonProps {
  count?: number;
}

export const VocabularyCardSkeleton: React.FC<VocabularyCardSkeletonProps> = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="glass-panel p-6 rounded-3xl border border-foreground/5 animate-pulse flex flex-col justify-between h-56"
        >
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="w-12 h-5 bg-foreground/10 rounded-full" />
              <div className="w-16 h-5 bg-foreground/10 rounded-full" />
            </div>
            <div className="w-3/4 h-8 bg-foreground/10 rounded-xl mb-3" />
            <div className="w-1/2 h-5 bg-foreground/10 rounded-lg mb-4" />
          </div>
          <div className="w-full h-12 bg-foreground/5 rounded-xl" />
        </div>
      ))}
    </div>
  );
};
