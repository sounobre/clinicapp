// Caminho: src/App.tsx
import { useState, useEffect, useMemo } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { ProfileModal } from '@/components/modals/ProfileModal';
import { getVisibleMenus } from '@/config/accessControl';
import type { User } from '@/types';

// Importe suas páginas
import { DashboardPage } from '@/pages/DashboardPage';
import { AgendaPage } from '@/pages/AgendaPage';
import { PacientesPage } from '@/pages/PacientesPage';
import { ProntuariosPage } from '@/pages/ProntuariosPage';
import { PacienteDetalhesPage } from '@/pages/PacienteDetalhesPage';
// ... outros imports de página

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // Simula um usuário logado. Isso viria do seu contexto de autenticação.
  const [currentUser, setCurrentUser] = useState<User>({ id: 1, name: "Dr. Silva", email: "dr.silva@psicoapp.com", role: 'admin', plan: 'plano3' });
  
  const visibleMenus = useMemo(() => getVisibleMenus(currentUser.role, currentUser.plan), [currentUser]);
  const [activeTab, setActiveTab] = useState(visibleMenus[0]?.id || 'dashboard');
  
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);

  useEffect(() => {
    if (!visibleMenus.some(menu => menu.id === activeTab)) {
      setActiveTab(visibleMenus[0]?.id || 'dashboard');
    }
  }, [visibleMenus, activeTab]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSelectedClientId(null); // Reseta a seleção ao trocar de aba
  }

  const handleClientSelectForDetails = (clientId: number) => {
    const prontuariosIsVisible = visibleMenus.some(menu => menu.id === 'prontuarios');
    if (prontuariosIsVisible) {
      setSelectedClientId(clientId);
      setActiveTab('prontuarios');
    }
  }
  
  const handleBackToProntuariosList = () => {
    setSelectedClientId(null);
  }

  const renderActivePage = () => {
    if (!visibleMenus.some(menu => menu.id === activeTab)) {
        return <div className="p-6"><h2 className="text-2xl font-bold dark:text-slate-100">Acesso Negado</h2></div>;
    }

    if (activeTab === 'prontuarios' && selectedClientId) {
        return <PacienteDetalhesPage 
                  clientId={selectedClientId} 
                  onBack={handleBackToProntuariosList} 
                  currentUser={currentUser} 
               />;
    }

    switch (activeTab) {
      case 'dashboard': return <DashboardPage />;
      case 'agenda': return <AgendaPage currentUser={currentUser} />;
      case 'pacientes': return <PacientesPage />;
      case 'prontuarios': return <ProntuariosPage onClientSelect={handleClientSelectForDetails} />;
      // ... outros cases para as páginas restantes
      default: return <DashboardPage />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50">
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        visibleMenus={visibleMenus}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onProfileClick={() => setIsProfileModalOpen(true)} />
        <div className="flex-1 overflow-x-hidden overflow-y-auto">
          {renderActivePage()}
        </div>
      </div>
      <ProfileModal open={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
    </div>
  );
}