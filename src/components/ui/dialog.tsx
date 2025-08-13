// Caminho: src/components/ui/dialog.tsx
import React from 'react';
import ReactDOM from 'react-dom'; // 1. IMPORTE O ReactDOM
import { cn } from '@/lib/utils';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: 'md' | '2xl' | '4xl';
}

// Pega o elemento do DOM que criamos no index.html
const modalRoot = document.getElementById('modal-root');

export function Dialog({ open, onClose, children, size = 'md' }: DialogProps) {
  if (!open || !modalRoot) { // 3. Adiciona a verificação !modalRoot
    return null;
  }

  const dialogContent = (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 pt-16 overflow-y-auto" 
      onClick={onClose}
    >
      <div
        className={cn(
          "relative bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full m-4",
          size === 'md' && 'max-w-md',
          size === '2xl' && 'max-w-2xl',
          size === '4xl' && 'max-w-4xl'
        )}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );

  // 4. USA O PORTAL PARA RENDERIZAR O CONTEÚDO
  return ReactDOM.createPortal(dialogContent, modalRoot);
};