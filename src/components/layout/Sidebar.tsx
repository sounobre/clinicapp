// Caminho: src/components/layout/Sidebar.tsx
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { navItems } from '@/config/accessControl';

// Define os tipos para as props do componente
interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  visibleMenus: typeof navItems; // Usa o tipo inferido de navItems
}

export function Sidebar({ isOpen, setIsOpen, activeTab, onTabChange, visibleMenus }: SidebarProps) {
  return (
    <aside
      className={cn(
        "flex flex-col bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-20"
      )}
    >
      <div
        className={cn(
          "flex items-center h-20 px-6 border-b border-slate-200 dark:border-slate-700",
          isOpen ? "justify-between" : "justify-center"
        )}
      >
        {isOpen && <h1 className="text-xl font-bold text-slate-700 dark:text-slate-200">PsicoApp</h1>}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
          aria-label={isOpen ? "Fechar sidebar" : "Abrir sidebar"}
        >
          {isOpen ? (
            <PanelLeftClose className="w-6 h-6 text-slate-600 dark:text-slate-400" />
          ) : (
            <PanelLeftOpen className="w-6 h-6 text-slate-600 dark:text-slate-400" />
          )}
        </button>
      </div>
      <nav className="flex-1 py-6">
        <ul className="space-y-2 px-4">
          {visibleMenus.map(item => (
            <li key={item.id}>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); onTabChange(item.id); }}
                className={cn(
                  "flex items-center h-12 px-4 rounded-lg",
                  !isOpen && "justify-center",
                  activeTab === item.id
                    ? "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                )}
                title={item.label}
              >
                <item.icon className="w-6 h-6 flex-shrink-0" />
                {isOpen && <span className="ml-3">{item.label}</span>}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}