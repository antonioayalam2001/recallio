import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import type { AnswerRecord, GameQuestion } from '../../../application/useGame';
import { ScorePieChart } from './ScorePieChart';
import { ResponseTimeBarChart } from './ResponseTimeBarChart';

interface MatchSummaryProps {
  score: number;
  correctCount: number;
  incorrectCount: number;
  answers: AnswerRecord[];
  questions: GameQuestion[];
  onRestart: () => void;
}

const COLORS = {
  correct: '#10b981',
  incorrect: '#F43F5E',
};

/**
 * Pantalla de resumen al finalizar una partida.
 * Muestra estadísticas, gráfica donut, gráfica de barras y detalle por pregunta.
 *
 * Refactorizado (G11–G13): los tooltips y sub-gráficas ahora viven en
 * MatchSummaryTooltips.tsx, ScorePieChart.tsx y ResponseTimeBarChart.tsx.
 */
export const MatchSummary: React.FC<MatchSummaryProps> = ({
  score,
  correctCount,
  incorrectCount,
  answers,
  questions,
  onRestart,
}) => {
  const total = correctCount + incorrectCount;
  const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  // Data for pie chart
  const pieData = [
    {
      name: 'Correctas',
      value: correctCount,
      fill: COLORS.correct,
      percent: Math.round((correctCount / total) * 100),
    },
    {
      name: 'Incorrectas',
      value: incorrectCount,
      fill: COLORS.incorrect,
      percent: Math.round((incorrectCount / total) * 100),
    },
  ];

  // Data for bar chart
  const barData = answers.map((a, i) => {
    const q = questions.find((q) => q.wordId === a.wordId);
    return {
      name: q?.englishWord ?? `Q${i + 1}`,
      tiempo: a.timeSpentMs,
      fill: a.isCorrect ? COLORS.correct : COLORS.incorrect,
    };
  });

  const getGrade = () => {
    if (accuracy >= 90) return { label: '¡Sobresaliente! 🏆', color: 'text-yellow-500' };
    if (accuracy >= 70) return { label: '¡Muy bien! 🌟', color: 'text-green-500' };
    if (accuracy >= 50) return { label: 'Bien hecho 👍', color: 'text-blue-500' };
    return { label: '¡Sigue practicando! 💪', color: 'text-primary' };
  };

  const grade = getGrade();

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="max-w-3xl mx-auto px-4 py-8 space-y-6"
    >
      {/* Header stats */}
      <div className="bg-card p-8 rounded-3xl shadow-xl border border-primary/10 text-center">
        <Trophy className="w-16 h-16 mx-auto text-yellow-500 mb-3" />
        <h2 className="text-4xl font-black mb-1">Partida Finalizada</h2>
        <p className={`text-xl font-bold ${grade.color}`}>{grade.label}</p>
        <div className="flex justify-center gap-8 mt-6">
          <div>
            <p className="text-4xl font-black text-primary">{score}</p>
            <p className="text-sm opacity-60 font-semibold">Puntos</p>
          </div>
          <div>
            <p className="text-4xl font-black text-green-500">{correctCount}</p>
            <p className="text-sm opacity-60 font-semibold">Correctas</p>
          </div>
          <div>
            <p className="text-4xl font-black text-red-500">{incorrectCount}</p>
            <p className="text-sm opacity-60 font-semibold">Incorrectas</p>
          </div>
          <div>
            <p className="text-4xl font-black">{accuracy}%</p>
            <p className="text-sm opacity-60 font-semibold">Precisión</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <ScorePieChart pieData={pieData} />
      <ResponseTimeBarChart barData={barData} />

      {/* Answer detail list */}
      <div className="bg-card p-6 rounded-3xl shadow-xl border border-border">
        <h3 className="text-lg font-black mb-4">Detalle por Pregunta</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {answers.map((a, i) => {
            const q = questions.find((q) => q.wordId === a.wordId);
            return (
              <div
                key={i}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold ${
                  a.isCorrect
                    ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                    : 'bg-red-500/10 text-red-500'
                }`}
              >
                <div className="flex items-center gap-2">
                  {a.isCorrect ? (
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 flex-shrink-0" />
                  )}
                  <span className="font-black">{q?.englishWord}</span>
                </div>
                <div className="flex items-center gap-4 text-xs opacity-80">
                  <span>{(a.timeSpentMs / 1000).toFixed(1)}s</span>
                  <span className="font-black">
                    {a.pointsEarned > 0 ? `+${a.pointsEarned}` : a.pointsEarned} pts
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Restart button */}
      <button
        onClick={onRestart}
        className="w-full bg-primary text-white font-black text-lg py-5 rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform shadow-[0_4px_24px_rgba(244,63,94,0.4)]"
      >
        <RotateCcw className="w-5 h-5" />
        Jugar de Nuevo
      </button>
    </motion.div>
  );
};
