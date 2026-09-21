import React, { useState, useEffect, useRef } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { Menu, X, Gamepad2, Layers, BookOpen, ShieldAlert, LogIn, LogOut, User, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../application/useAuth';

/**
 * Componente de Navegación Principal
 *
 * @component Navbar
 */
export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();

  // Sincronizar estado de sesión y ruta activa
  const syncAuthState = () => {
    const auth = localStorage.getItem('isAuthenticated') === 'true';
    const userRole = localStorage.getItem('role');
    setIsAuthenticated(auth);
    setRole(userRole);
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    syncAuthState();

    // Cerrar menú de usuario al hacer clic fuera
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Sincronizar en cada cambio de página con Astro ViewTransitions
    document.addEventListener('astro:page-load', syncAuthState);
    return () => {
      document.removeEventListener('astro:page-load', syncAuthState);
    };
  }, []);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await logout();
    setIsOpen(false);
    setIsUserMenuOpen(false);
  };

  const mainNavLinks = [
    { href: '/', label: 'Jugar', icon: Gamepad2, requireAuth: true },
    { href: '/flashcards', label: 'Flashcards', icon: Layers, requireAuth: true },
    { href: '/vocabulary', label: 'Vocabulario', icon: BookOpen, requireAuth: true },
  ];

  const userNavLinks = [
    { href: '/profile', label: 'Perfil', icon: User, requireAuth: true },
    {
      href: '/admin',
      label: 'Admin Panel',
      icon: ShieldAlert,
      requireAuth: true,
      requireAdmin: true,
    },
  ];

  const allNavLinks = [...mainNavLinks, ...userNavLinks];

  const filterLinks = (links: { href: string; label: string; requireAuth: boolean; requireAdmin?: boolean }[]) => links.filter((link) => {
    if (!isAuthenticated) return false;
    if (link.requireAdmin && role !== 'ADMIN') return false;
    return true;
  });

  const visibleMainLinks = filterLinks(mainNavLinks);
  const visibleUserLinks = filterLinks(userNavLinks);
  const visibleMobileLinks = filterLinks(allNavLinks);

  return (
    <header className="sticky top-3 z-50 w-[95%] max-w-5xl mx-auto transition-all duration-300">
      {/* BARRA PRINCIPAL */}
      <div className="glass-panel shadow-lg shadow-black/5 rounded-full px-4 sm:px-6 py-2.5 sm:py-3 flex justify-between items-center relative">
        {/* LOGO */}
        <a href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-primary to-rose-400 flex items-center justify-center text-white font-black text-base sm:text-lg shadow-md group-hover:scale-105 transition-transform">
            ⚡
          </div>
          <div className="flex items-center">
            <span className="text-lg sm:text-xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors">
              Recall<span className="text-primary">io</span>
            </span>
            <span className="hidden md:inline-block text-[10px] font-bold uppercase tracking-widest opacity-40 ml-2 px-1.5 py-0.5 rounded-full bg-foreground/5">
              Active Recall
            </span>
          </div>
        </a>

        {/* NAVEGACIÓN ESCRITORIO (md y superior) */}
        <nav className="hidden md:flex gap-1 items-center text-sm font-bold">
          {visibleMainLinks.map((link) => {
            const isActive = currentPath === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                className={`px-3.5 py-1.5 rounded-full transition-all duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-primary text-white shadow-sm shadow-primary/30 font-black'
                    : 'hover:bg-foreground/5 text-foreground/80 hover:text-primary'
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* ACCIONES DERECHA (ThemeToggle + Auth + Hamburguesa móvil) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />

          {/* Botón de Auth en Desktop */}
          <div className="hidden md:block">
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="bg-foreground/5 text-foreground/80 hover:bg-foreground/10 px-3 py-1.5 rounded-full font-bold text-xs transition-colors flex items-center gap-1.5 border border-foreground/10"
                >
                  <User className="w-4 h-4" />
                  <span>Cuenta</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-3 w-48 bg-card rounded-2xl shadow-xl border border-foreground/10 overflow-hidden flex flex-col py-2"
                    >
                      {visibleUserLinks.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          className={`px-4 py-2.5 text-sm font-bold flex items-center gap-3 transition-colors ${
                            currentPath === link.href
                              ? 'bg-primary/10 text-primary'
                              : 'hover:bg-foreground/5 text-foreground/80 hover:text-foreground'
                          }`}
                        >
                          <link.icon className="w-4 h-4 opacity-70" />
                          {link.label}
                        </a>
                      ))}
                      <div className="h-px bg-foreground/10 my-1 mx-3" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-sm font-bold text-error/80 hover:text-error hover:bg-error/10 transition-colors flex items-center gap-3"
                      >
                        <LogOut className="w-4 h-4 opacity-70" />
                        Cerrar Sesión
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <a
                href="/auth"
                className="bg-primary text-white px-5 py-1.5 rounded-full font-bold text-xs hover:opacity-90 hover:scale-105 transition-all shadow-[0_2px_10px_rgba(225,29,72,0.25)] flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                Ingresar
              </a>
            )}
          </div>

          {/* BOTÓN HAMBURGUESA MÓVIL (visible solo en < md) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="md:hidden p-2 rounded-full hover:bg-foreground/10 text-foreground/80 hover:text-primary transition-colors focus:outline-none"
            aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú de navegación'}
          >
            {isOpen ? <X className="w-6 h-6 text-primary" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MENÚ DESPLEGABLE MÓVIL (AnimatePresence) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="md:hidden mt-2 glass-panel rounded-3xl p-4 shadow-xl border border-foreground/10 overflow-hidden"
          >
            <nav className="flex flex-col gap-1.5">
              {visibleMobileLinks.map((link) => {
                const isActive = currentPath === link.href;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`px-4 py-3 rounded-2xl text-sm font-bold flex items-center gap-3 transition-colors ${
                      isActive
                        ? 'bg-primary text-white shadow-sm shadow-primary/30 font-black'
                        : 'hover:bg-foreground/5 text-foreground/80 hover:text-primary'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-xl ${isActive ? 'bg-white/20' : 'bg-foreground/5'}`}
                    >
                      <link.icon className="w-4 h-4" />
                    </div>
                    <span>{link.label}</span>
                  </a>
                );
              })}

              {/* Botón de Auth en Móvil */}
              <div className="pt-2 mt-2 border-t border-foreground/10">
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    className="w-full py-3 px-4 rounded-2xl text-sm font-bold bg-error/10 text-error hover:bg-error hover:text-white transition-colors flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar Sesión
                  </button>
                ) : (
                  <a
                    href="/auth"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-3 px-4 rounded-2xl text-sm font-bold bg-primary text-white flex items-center justify-center gap-2 shadow-[0_2px_10px_rgba(225,29,72,0.25)]"
                  >
                    <LogIn className="w-4 h-4" />
                    Ingresar
                  </a>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
