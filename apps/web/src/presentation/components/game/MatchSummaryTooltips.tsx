import React from 'react';

/**
 * Tooltip personalizado para la gráfica Pie (donut) del resumen de partida.
 * Muestra nombre, valor y porcentaje con el color correspondiente.
 *
 * Extraído de MatchSummary.tsx (G11 del plan de refactorización).
 */
export const CustomTooltipPie = ({ active, payload }: { active?: boolean; payload?: Record<string, unknown>[] }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-xl px-3 py-2 text-sm font-bold shadow-lg">
        <span style={{ color: payload[0].payload.fill }}>{payload[0].name}: </span>
        {payload[0].value} ({payload[0].payload.percent}%)
      </div>
    );
  }
  return null;
};

/**
 * Tooltip personalizado para la gráfica de barras de tiempo de respuesta.
 * Muestra la pregunta y el tiempo en segundos con el color correspondiente.
 *
 * Extraído de MatchSummary.tsx (G11 del plan de refactorización).
 */
export const CustomTooltipBar = ({ active, payload, label }: { active?: boolean; payload?: Record<string, unknown>[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-xl px-3 py-2 text-sm shadow-lg">
        <p className="font-black text-foreground mb-1">{label}</p>
        <p className="font-semibold" style={{ color: payload[0].fill }}>
          {(payload[0].value / 1000).toFixed(1)}s
        </p>
      </div>
    );
  }
  return null;
};
