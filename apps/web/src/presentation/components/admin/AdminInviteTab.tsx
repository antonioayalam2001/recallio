import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { useInviteForm } from './hooks/useInviteForm';

interface AdminInviteTabProps {
  isActionLoading: boolean;
  generatedToken: string | null;
  generateInvite: (email: string) => Promise<void>;
}

export const AdminInviteTab: React.FC<AdminInviteTabProps> = ({
  isActionLoading,
  generatedToken,
  generateInvite,
}) => {
  const {
    registerInvite,
    handleInviteSubmit,
    onGenerateInvite,
    inviteErrors,
  } = useInviteForm({ generateInvite });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-md mx-auto"
    >
      <h3 className="text-2xl font-black mb-2 text-center">Generar Invitación Admin</h3>
      <p className="text-center opacity-70 mb-8 text-sm">
        Crea un token de un solo uso para que otro usuario pueda registrarse con privilegios
        de administrador.
      </p>

      <form onSubmit={handleInviteSubmit(onGenerateInvite)} className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-bold opacity-70 ml-2">Correo del Futuro Admin</label>
          <input
            {...registerInvite('email')}
            type="email"
            placeholder="admin@englishgrammar.com"
            className={`w-full mt-1 bg-background border-2 focus:border-primary rounded-xl px-4 py-3 font-semibold outline-none transition-colors ${
              inviteErrors.email ? 'border-error' : 'border-transparent'
            }`}
          />
          {inviteErrors.email && (
            <span className="text-error text-xs ml-2 mt-1 block font-semibold">
              {inviteErrors.email.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={isActionLoading}
          className="w-full py-4 mt-2 font-black rounded-xl bg-primary text-white shadow-lg shadow-primary/30 hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
        >
          {isActionLoading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            'Generar Token Seguro'
          )}
        </button>
      </form>

      <AnimatePresence>
        {generatedToken && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 bg-success/10 border border-success/20 rounded-2xl text-center"
          >
            <p className="text-sm font-bold text-success mb-3">¡Token Generado!</p>
            <div className="bg-background font-mono text-sm p-3 rounded-lg flex items-center justify-between border border-success/10 gap-2">
              <span className="truncate">{generatedToken}</span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(generatedToken);
                  toast.success('Token copiado al portapapeles');
                }}
                className="p-2 hover:bg-success/20 rounded-md text-success transition-colors shrink-0"
                title="Copiar al portapapeles"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs opacity-60 mt-3">
              Envía este token a la persona. Deberá usarlo al registrarse.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
