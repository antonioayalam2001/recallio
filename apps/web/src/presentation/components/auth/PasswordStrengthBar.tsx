import React from 'react';

interface PasswordStrengthBarProps {
  password: string;
}

interface StrengthRequirement {
  label: string;
  met: boolean;
}

function getStrengthLevel(password: string): {
  score: number;
  label: string;
  color: string;
  barColor: string;
} {
  if (!password) return { score: 0, label: '', color: '', barColor: '' };

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%^&*]/.test(password)) score++;

  const levels = [
    { score: 1, label: 'Muy débil', color: 'text-red-500', barColor: 'bg-red-500' },
    { score: 2, label: 'Débil', color: 'text-orange-500', barColor: 'bg-orange-500' },
    { score: 3, label: 'Fuerte', color: 'text-yellow-500', barColor: 'bg-yellow-500' },
    { score: 4, label: 'Muy fuerte', color: 'text-green-500', barColor: 'bg-green-500' },
  ];

  return levels[score - 1] ?? { score: 0, label: '', color: '', barColor: '' };
}

/**
 * Componente visual de fortaleza de contraseña.
 * Muestra una barra de 4 niveles de color y un checklist de requisitos en tiempo real.
 */
export const PasswordStrengthBar: React.FC<PasswordStrengthBarProps> = ({ password }) => {
  if (!password) return null;

  const strength = getStrengthLevel(password);

  const requirements: StrengthRequirement[] = [
    { label: '8 o más caracteres', met: password.length >= 8 },
    { label: 'Una letra mayúscula (A-Z)', met: /[A-Z]/.test(password) },
    { label: 'Un número (0-9)', met: /[0-9]/.test(password) },
    { label: 'Un carácter especial (!@#$%^&*)', met: /[!@#$%^&*]/.test(password) },
  ];

  return (
    <div className="mt-2 px-1">
      {/* Barra de progreso */}
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              level <= strength.score ? strength.barColor : 'bg-gray-200 dark:bg-gray-700'
            }`}
          />
        ))}
      </div>

      {/* Etiqueta de nivel */}
      {strength.label && (
        <p className={`text-xs font-semibold mb-2 ${strength.color}`}>{strength.label}</p>
      )}

      {/* Checklist de requisitos */}
      <ul className="space-y-0.5">
        {requirements.map((req) => (
          <li key={req.label} className="flex items-center gap-1.5 text-xs">
            <span
              className={`font-bold transition-colors duration-200 ${
                req.met ? 'text-green-500' : 'text-gray-400'
              }`}
            >
              {req.met ? '✓' : '○'}
            </span>
            <span className={req.met ? 'text-green-500' : 'opacity-60'}>{req.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
