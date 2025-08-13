// Caminho: src/components/layout/Header.tsx
import React, { useState, useRef } from 'react';
import { Search, Bell, User, LogOut } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useClickOutside } from '@/hooks/useClickOutside';

interface HeaderProps {
  onProfileClick: () => void;
}

export function Header({ onProfileClick }: HeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // Hook para fechar o menu dropdown ao clicar fora
  useClickOutside(profileRef, () => setIsProfileOpen(false));

  return (
    <header className="flex justify-between items-center h-20 px-6 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
      <div className="relative">
        <Search className="w-5 h-5 text-slate-400 absolute top-1/2 left-3 -translate-y-1/2" />
        <Input type="text" placeholder="Pesquisar..." className="w-full max-w-xs pl-10" />
      </div>
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        <button className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Notificações">
          <Bell className="w-6 h-6" />
        </button>
        <div className="relative" ref={profileRef}>
          <button onClick={() => setIsProfileOpen(prev => !prev)} className="flex items-center space-x-3">
            <span className="text-slate-700 dark:text-slate-300 font-medium hidden sm:block">Olá, Dr. Silva</span>
            <div className="w-10 h-10 bg-slate-300 dark:bg-slate-600 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400">
              <User />
            </div>
          </button>
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg py-1 border dark:border-slate-700 z-20">
              <button
                onClick={() => { onProfileClick(); setIsProfileOpen(false); }}
                className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <User className="mr-2 h-4 w-4" /> Meu Perfil
              </button>
              <a href="#" className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                <LogOut className="mr-2 h-4 w-4" /> Sair
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}