import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface GlassShatterProps {
  type: 'correct' | 'incorrect' | null;
  onComplete: () => void;
}

export const GlassShatter: React.FC<GlassShatterProps> = ({ type, onComplete }) => {
  interface Shard {
    id: number;
    color: string;
    size: number;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    rotation: number;
    clipPath: string;
    scale: number;
    duration: number;
  }
  const [shards, setShards] = useState<Shard[]>([]);

  useEffect(() => {
    if (!type) return;

    // Generamos 40 fragmentos (shards) aleatorios
    const newShards = Array.from({ length: 40 }).map((_, i) => {
      const isCorrect = type === 'correct';
      // Colores de cristal: blanco/celeste para correcto, rojo/oscuro para incorrecto
      const baseColors = isCorrect
        ? ['#ffffff', '#e0f2fe', '#7dd3fc', '#bae6fd']
        : ['#fee2e2', '#fca5a5', '#ef4444', '#7f1d1d'];

      const color = baseColors[Math.floor(Math.random() * baseColors.length)];

      // Tamaño aleatorio del polígono
      const size = Math.random() * 40 + 20;
      // Posición inicial centralizada (con un poco de ruido)
      const startX = 50 + (Math.random() * 20 - 10);
      const startY = 50 + (Math.random() * 20 - 10);

      // Dirección y fuerza de la explosión
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 300 + 100;

      const endX = Math.cos(angle) * velocity;
      const endY = Math.sin(angle) * velocity + 150; // Gravedad hacia abajo

      const rotation = Math.random() * 720 - 360;

      // Forma de triángulo aleatorio para simular cristal
      const clipPath = `polygon(0% 0%, ${Math.random() * 100}% ${Math.random() * 100}%, ${Math.random() * 100}% 100%)`;

      const scale = Math.random() * 0.5 + 0.5;
      const duration = 0.8 + Math.random() * 0.4;

      return {
        id: i,
        color,
        size,
        startX,
        startY,
        endX,
        endY,
        rotation,
        clipPath,
        scale,
        duration,
      };
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShards(newShards);

    const timer = setTimeout(() => {
      setShards([]);
      onComplete();
    }, 1200);

    return () => clearTimeout(timer);
  }, [type, onComplete]);

  if (!type || shards.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden flex items-center justify-center">
      {shards.map((shard) => (
        <motion.div
          key={shard.id}
          initial={{
            x: 0,
            y: 0,
            opacity: 1,
            rotate: 0,
            scale: shard.scale,
          }}
          animate={{
            x: shard.endX,
            y: shard.endY,
            opacity: 0,
            rotate: shard.rotation,
          }}
          transition={{
            duration: shard.duration,
            ease: [0.19, 1, 0.22, 1], // easeOutExpo para un estallido inicial fuerte
          }}
          style={{
            position: 'absolute',
            width: shard.size,
            height: shard.size,
            backgroundColor: shard.color,
            clipPath: shard.clipPath,
            boxShadow: '0 0 10px rgba(255,255,255,0.5)', // Brillo tipo cristal
          }}
        />
      ))}
    </div>
  );
};
