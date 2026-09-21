import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';

type AuthView = 'login' | 'register' | 'forgot-password';

/**
 * Componente orquestador de los flujos de autenticación.
 * Gestiona el estado de la vista activa (login, registro, recuperación de contraseña)
 * y delega el renderizado a los formularios especializados.
 */
export const AuthForms: React.FC = () => {
  const [view, setView] = useState<AuthView>(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('forgot') === 'true') {
        return 'forgot-password';
      }
    }
    return 'login';
  });

  return (
    <div className="w-full max-w-md mx-auto relative mt-10">
      <div className="bg-card shadow-2xl border border-primary/10 rounded-3xl p-8 relative overflow-hidden">
        <div className="relative z-10">
          {/* Título dinámico según la vista */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-black text-primary mb-2">
              {view === 'login' && '¡Bienvenido de vuelta!'}
              {view === 'register' && 'Crea tu Cuenta'}
              {view === 'forgot-password' && 'Recupera tu Acceso'}
            </h2>
            {view === 'login' && (
              <p className="opacity-70 text-sm">Ingresa tus credenciales para continuar.</p>
            )}
            {view === 'register' && (
              <p className="opacity-70 text-sm">
                Únete para registrar tu progreso y proponer palabras.
              </p>
            )}
          </div>

          {/* Formularios con transición animada */}
          <AnimatePresence mode="wait">
            {view === 'login' && (
              <LoginForm
                onSwitchToRegister={() => setView('register')}
                onForgotPassword={() => setView('forgot-password')}
              />
            )}
            {view === 'register' && (
              <RegisterForm onSwitchToLogin={() => setView('login')} />
            )}
            {view === 'forgot-password' && (
              <ForgotPasswordForm onBack={() => setView('login')} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
