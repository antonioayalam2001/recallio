import React from 'react';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { CustomTooltipBar } from './MatchSummaryTooltips';

export interface BarDataEntry {
  name: string;
  tiempo: number;
  fill: string;
}

interface ResponseTimeBarChartProps {
  barData: BarDataEntry[];
}

/**
 * Gráfica de barras con el tiempo de respuesta por pregunta.
 * Verde = respuesta correcta · Rojo = respuesta incorrecta.
 *
 * Extraído de MatchSummary.tsx (G13 del plan de refactorización).
 */
export const ResponseTimeBarChart: React.FC<ResponseTimeBarChartProps> = ({ barData }) => {
  if (barData.length === 0) return null;

  return (
    <div className="bg-card p-6 rounded-3xl shadow-xl border border-border">
      <h3 className="text-lg font-black mb-4 text-center">Tiempo de Respuesta por Pregunta</h3>
      <p className="text-xs text-center text-muted-foreground mb-4">
        Verde = correcta · Rojo = incorrecta
      </p>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, fill: 'currentColor', opacity: 0.5 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}s`}
              tick={{ fontSize: 10, fill: 'currentColor', opacity: 0.5 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              content={<CustomTooltipBar />}
              cursor={{ fill: 'rgba(255,255,255,0.04)' }}
            />
            <Bar dataKey="tiempo" radius={[6, 6, 0, 0]}>
              {barData.map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
