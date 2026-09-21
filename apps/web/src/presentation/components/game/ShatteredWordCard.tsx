import React from 'react';
import { motion } from 'framer-motion';
import { WordCardContent } from './WordCard';
import type { GameQuestion } from '../../../application/useGame';

interface ShatteredWordCardProps {
  question: GameQuestion;
  timeLeft: number;
}

export const ShatteredWordCard: React.FC<ShatteredWordCardProps> = (props) => {
  // 5 fragmentos irregulares que simulan un cristal roto
  const shards = [
    {
      id: 1,
      clipPath: 'polygon(0% 0%, 45% 0%, 35% 45%, 0% 60%)',
      endX: -60,
      endY: 100,
      rotate: -25,
    },
    {
      id: 2,
      clipPath: 'polygon(45% 0%, 100% 0%, 100% 35%, 35% 45%)',
      endX: 70,
      endY: 80,
      rotate: 30,
    },
    {
      id: 3,
      clipPath: 'polygon(0% 60%, 35% 45%, 55% 100%, 0% 100%)',
      endX: -40,
      endY: 150,
      rotate: -15,
    },
    {
      id: 4,
      clipPath: 'polygon(35% 45%, 100% 35%, 100% 70%, 75% 55%)',
      endX: 90,
      endY: 60,
      rotate: 45,
    },
    {
      id: 5,
      clipPath: 'polygon(75% 55%, 100% 70%, 100% 100%, 55% 100%, 35% 45%)',
      endX: 30,
      endY: 180,
      rotate: 10,
    },
  ];

  return (
    <div className="relative w-full max-w-lg mx-auto h-64 pointer-events-none">
      {shards.map((shard) => (
        <motion.div
          key={shard.id}
          className="absolute inset-0 w-full h-full"
          style={{ clipPath: shard.clipPath }}
          initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
          animate={{
            x: shard.endX,
            y: shard.endY,
            rotate: shard.rotate,
            opacity: 0,
          }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <WordCardContent {...props} />
        </motion.div>
      ))}
    </div>
  );
};
