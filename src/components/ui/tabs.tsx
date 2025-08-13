// --- FILE: src/components/ui/tabs.tsx ---
// Cole este código para substituir o conteúdo do seu arquivo.

import React, { useState, createContext, useContext } from 'react';
import { cn } from "@/lib/utils"; // Certifique-se que o caminho para o seu `cn` está correto.

// Contexto para compartilhar o estado da aba ativa
const TabsContext = createContext<{ activeTab: string; setActiveTab: (value: string) => void; } | null>(null);

// Componente principal que gerencia o estado
const Tabs = ({ children, defaultValue }: { children: React.ReactNode; defaultValue: string; }) => {
    const [activeTab, setActiveTab] = useState(defaultValue);
    return <TabsContext.Provider value={{ activeTab, setActiveTab }}>{children}</TabsContext.Provider>;
};

// A lista que contém os botões das abas (com a linha divisória)
const TabsList = ({ children, className }: { children: React.ReactNode; className?: string; }) => (
    <div className={cn("flex border-b border-slate-200 dark:border-slate-700", className)}>
        {children}
    </div>
);

// O botão de cada aba (com a lógica de estilo para ativa/inativa)
const TabsTrigger = ({ value, children, className }: { value: string; children: React.ReactNode; className?: string; }) => {
    const context = useContext(TabsContext);
    if (!context) {
        throw new Error("TabsTrigger must be used within a Tabs component");
    }
    const { activeTab, setActiveTab } = context;
    const isActive = activeTab === value;

    return (
        <button
            type="button"
            onClick={() => setActiveTab(value)}
            className={cn(
                "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                isActive
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200",
                className
            )}
        >
            {children}
        </button>
    );
};

// O conteúdo que aparece quando uma aba está ativa
const TabsContent = ({ value, children, className }: { value: string; children: React.ReactNode; className?: string; }) => {
    const context = useContext(TabsContext);
    if (!context) {
        throw new Error("TabsContent must be used within a Tabs component");
    }
    const { activeTab } = context;

    return activeTab === value ? <div className={cn(className)}>{children}</div> : null;
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
