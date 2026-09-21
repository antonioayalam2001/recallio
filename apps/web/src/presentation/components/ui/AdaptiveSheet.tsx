import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useDragControls, type PanInfo } from 'framer-motion';
import { X } from 'lucide-react';

interface AdaptiveSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: string;
}

/**
 * Componente adaptativo optimizado y reutilizable:
 * - En móvil (< 768px): Se presenta como un Bottom Drawer / Bottom Sheet nativo con barra de arrastre y swipe-to-dismiss.
 * - En escritorio (>= 768px): Se presenta como un Diálogo Modal centrado con fondo difuminado.
 *
 * @component AdaptiveSheet
 */
export const AdaptiveSheet: React.FC<AdaptiveSheetProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'max-w-xl',
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const dragControls = useDragControls();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Bloquear scroll de la página de fondo cuando el diálogo está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Cerrar con tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Manejador de gesto de arrastre hacia abajo en móvil para cerrar
  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 100 || info.velocity.y > 400) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          {/* TELÓN DE FONDO (Backdrop) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
          />

          {/* CONTENEDOR ADAPTATIVO (Drawer en móvil, Modal en desktop) */}
          <motion.div
            drag={isMobile ? 'y' : false}
            dragListener={false}
            dragControls={dragControls}
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={isMobile ? handleDragEnd : undefined}
            initial={isMobile ? { y: '100%' } : { opacity: 0, scale: 0.95, y: 15 }}
            animate={isMobile ? { y: 0 } : { opacity: 1, scale: 1, y: 0 }}
            exit={isMobile ? { y: '100%' } : { opacity: 0, scale: 0.95, y: 15 }}
            transition={
              isMobile
                ? { type: 'spring', damping: 28, stiffness: 300 }
                : { duration: 0.2, ease: 'easeOut' }
            }
            className={`relative bg-card w-full ${maxWidth} z-10 shadow-2xl border border-primary/20 
              rounded-t-[2rem] md:rounded-3xl max-h-[90vh] md:max-h-[85vh] 
              flex flex-col overflow-hidden my-0 md:my-auto`}
          >
            {/* TIRADOR DE ARRASTRE TIPO iOS/ANDROID (Solo en móvil) */}
            <div
              onPointerDown={(e) => isMobile && dragControls.start(e)}
              className="w-full flex justify-center pt-3 pb-1 md:hidden cursor-grab active:cursor-grabbing touch-none select-none"
            >
              <div className="w-12 h-1.5 bg-foreground/20 rounded-full" />
            </div>

            {/* CABECERA */}
            <div
              onPointerDown={(e) => {
                const target = e.target as HTMLElement;
                if (isMobile && !target.closest('button')) {
                  dragControls.start(e);
                }
              }}
              className="p-6 md:p-8 pb-4 flex justify-between items-start shrink-0 select-none md:select-auto cursor-grab md:cursor-auto active:cursor-grabbing md:active:cursor-auto"
            >
              <div className="pr-4">
                <h2 className="text-xl md:text-2xl font-black text-primary tracking-tight">
                  {title}
                </h2>
                {description && <div className="text-xs opacity-70 mt-1">{description}</div>}
              </div>

              <button
                onClick={onClose}
                type="button"
                className="p-2 rounded-full hover:bg-foreground/10 text-foreground/60 hover:text-primary transition-colors shrink-0"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* CONTENIDO SCROLLEABLE */}
            <div className="p-6 pt-0 overflow-y-auto flex-1 overscroll-contain">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
