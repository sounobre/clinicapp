// Caminho: src/components/ThemeProvider.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define o tipo para o estado do provedor de tema
type Theme = "light" | "dark";

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

// Define o estado inicial
const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
};

// Cria o contexto do provedor de tema
const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

// Componente Provedor do Tema
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => 
    (localStorage.getItem("vite-ui-theme") as Theme) || "light"
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("vite-ui-theme", theme);
  }, [theme]);

  const value = {
    theme,
    setTheme,
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

// Hook customizado para usar o tema
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};