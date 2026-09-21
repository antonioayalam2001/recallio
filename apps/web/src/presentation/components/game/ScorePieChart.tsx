import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { CustomTooltipPie } from './MatchSummaryTooltips';

interface PieEntry {
  name: string;
  value: number;
  fill: string;
  percent: number;
}

interface ScorePieChartProps {
  pieData: PieEntry[];
}

/**
 * Gráfica donut de distribución de respuestas correctas / incorrectas.
 * Incluye leyenda lateral con barras de progreso proporcionales.
 *
 * Extraído de MatchSummary.tsx (G12 del plan de refactorización).
 */
export const ScorePieChart: React.FC<ScorePieChartProps> = ({ pieData }) => {
  return (
    <div className="bg-card p-6 rounded-3xl shadow-xl border border-border">
      <h3 className="text-lg font-black mb-4 text-center">Distribución de Respuestas</h3>
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Donut */}
        <div className="w-full md:w-1/2 h-52">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltipPie />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend with progress bars */}
        <div className="flex flex-col gap-3 md:w-1/2">
          {pieData.map((entry) => (
            <div key={entry.name} className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: entry.fill }}
              />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm">{entry.name}</span>
                  <span className="font-black" style={{ color: entry.fill }}>
                    {entry.value}
                  </span>
                </div>
                <div className="w-full bg-foreground/10 rounded-full h-1.5 mt-1">
                  <div
                    className="h-1.5 rounded-full transition-all"
                    style={{ width: `${entry.percent}%`, backgroundColor: entry.fill }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
