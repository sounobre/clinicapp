// Caminho: src/pages/AgendaPage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Plus, X, Users, Calendar, Clock, StickyNote } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useCalendar } from '@/hooks/useCalendar';

// Supondo que você crie estes serviços para interagir com a API
// import { getSessions, saveSession, deleteSession } from '@/services/sessionService';
// import { getClients } from '@/services/patientService';

import { SessionModal } from '@/components/modals/SessionModal';
import type { Session, Client, User } from '@/types';

// TODO: Mover as visualizações do calendário para seus próprios arquivos em `src/pages/agenda/components/`
import { MonthlyView } from './agenda/components/MonthlyView';
import { WeeklyView } from './agenda/components/WeeklyView';
import { DailyView } from './agenda/components/DailyView';

interface AgendaPageProps {
  currentUser: User;
}

export function AgendaPage({ currentUser }: AgendaPageProps) {
  const calendar = useCalendar('monthly');
  const { view, setView, setDate } = calendar;
  
  const [sessions, setSessions] = useState<Session[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [dateClickData, setDateClickData] = useState<{ date: Date; time: string; } | null>(null);

  // Função para buscar dados da API
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Em uma aplicação real, você faria as chamadas aqui:
      // const [sessionsData, clientsData] = await Promise.all([
      //   getSessions(),
      //   getClients() 
      // ]);
      // setSessions(sessionsData);
      // setClients(clientsData);

      // Por enquanto, usamos dados mocados para simulação
      const mockSessions: Session[] = [{id: 1, pacienteId: 1, data_sessao: "2025-08-11", hora_inicio: "14:00", duracao_minutos: 50, titulo_sessao: "Consulta Ana P.", notas_agendamento: "Consulta de rotina.", tipo_sessao: "Online", status_sessao: "Realizada", valor_sessao: 150, recorrencia: "Nao se repete"}];
      const mockClients: Client[] = [{ id: 1, name: 'Ana Pereira', email: 'ana.p@example.com', phone: '(21) 99999-8888', status: 'Ativo', nome_completo: 'Ana Pereira da Silva', cpf: '111.222.333-44', data_nascimento: '1990-05-15', consentimento_lgpd: true }];
      setSessions(mockSessions);
      setClients(mockClients);

    } catch (err) {
      setError("Falha ao buscar dados da agenda. Tente novamente.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSaveSession = async (data: any) => {
    try {
      // Lógica de API para salvar
      // if (selectedSession) {
      //   await updateSession(selectedSession.id, data);
      // } else {
      //   await createSession(data);
      // }
      alert(`Sessão "${data.titulo_sessao}" salva com sucesso! (Simulação)`);
      fetchData(); // Re-busca os dados para atualizar a UI
    } catch (error) {
      alert("Erro ao salvar a sessão.");
      console.error(error);
    }
    setSelectedSession(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedSession) return;
    try {
      // await deleteSession(selectedSession.id);
      alert("Sessão apagada com sucesso! (Simulação)");
      fetchData(); // Re-busca os dados
    } catch (error) {
      alert("Erro ao apagar sessão.");
      console.error(error);
    }
    setIsDeleteConfirmOpen(false);
    setIsDetailModalOpen(false);
    setSelectedSession(null);
  };

  const handleDateClick = (date: Date) => { setDate(date); setView('daily'); };
  
  const handleTimeSlotClick = (date: Date, time: string) => {
    setSelectedSession(null);
    setDateClickData({ date, time });
    setIsModalOpen(true);
  };
  
  const handleAppointmentClick = (session: Session) => {
    setSelectedSession(session);
    setIsDetailModalOpen(true);
  };
  
  const openEditModal = () => {
    setIsDetailModalOpen(false);
    setIsModalOpen(true);
  };

  const viewOptions = [{ id: 'daily', label: 'Diário' }, { id: 'weekly', label: 'Semanal' }, { id: 'monthly', label: 'Mensal' }];

  if (isLoading) return <div className="p-6">Carregando agenda...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <main className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Agenda</h2>
        <div className='flex items-center space-x-4'>
          <div className="flex items-center p-1 bg-slate-200 dark:bg-slate-700 rounded-lg">
            {viewOptions.map(option => (
              <button key={option.id} onClick={() => setView(option.id as any)} className={cn("px-3 py-1 text-sm font-medium rounded-md", view === option.id ? "bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow" : "text-slate-600 dark:text-slate-300")}>
                {option.label}
              </button>
            ))}
          </div>
          <Button onClick={() => { setSelectedSession(null); setDateClickData(null); setIsModalOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" /> Novo Agendamento
          </Button>
        </div>
      </div>
      
      {/* Renderização condicional da visualização do calendário */}
      {view === 'monthly' && <MonthlyView calendar={calendar} sessions={sessions} onDateClick={handleDateClick} onAppointmentClick={handleAppointmentClick} onTimeSlotClick={handleTimeSlotClick} />}
      {view === 'weekly' && <WeeklyView calendar={calendar} sessions={sessions} onDateClick={handleDateClick} onAppointmentClick={handleAppointmentClick} onTimeSlotClick={handleTimeSlotClick} />}
      {view === 'daily' && <DailyView calendar={calendar} sessions={sessions} onAppointmentClick={handleAppointmentClick} onTimeSlotClick={handleTimeSlotClick} onDateClick={handleDateClick} />}
      
      {/* Modais */}
      <SessionModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSession}
        userRole={currentUser.role}
        editingData={selectedSession}
        clients={clients}
        onDateClickData={dateClickData}
      />

      <Dialog open={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)}>
        {selectedSession && (
          <>
            <CardHeader>
              <CardTitle>{selectedSession.titulo_sessao}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setIsDetailModalOpen(false)} className="absolute top-3 right-3 h-8 w-8 rounded-full"><X className="h-5 w-5" /></Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center text-slate-600 dark:text-slate-400">
                <Users className="h-5 w-5 mr-3 text-slate-400"/>
                <span>{clients.find(c => c.id === selectedSession.pacienteId)?.name || 'Paciente não encontrado'}</span>
              </div>
              <div className="flex items-center text-slate-600 dark:text-slate-400">
                <Calendar className="h-5 w-5 mr-3 text-slate-400"/>
                <span>{new Date(selectedSession.data_sessao.replace(/-/g, '\/')).toLocaleDateString('pt-BR', { timeZone: 'UTC', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center text-slate-600 dark:text-slate-400">
                <Clock className="h-5 w-5 mr-3 text-slate-400"/>
                <span>{selectedSession.hora_inicio}</span>
              </div>
              {selectedSession.notas_agendamento && (
                <div className="flex items-start text-slate-600 dark:text-slate-400">
                  <StickyNote className="h-5 w-5 mr-3 mt-1 text-slate-400 flex-shrink-0"/>
                  <p className="flex-1">{selectedSession.notas_agendamento}</p>
                </div>
              )}
            </CardContent>
            <div className="flex justify-end p-6 pt-2 space-x-2 border-t border-slate-200 dark:border-slate-700">
              <Button variant="ghost" onClick={openEditModal}>Editar</Button>
              <Button variant="destructive" onClick={() => setIsDeleteConfirmOpen(true)}>Apagar Sessão</Button>
            </div>
          </>
        )}
      </Dialog>
      
      <Dialog open={isDeleteConfirmOpen} onClose={() => setIsDeleteConfirmOpen(false)}>
        <CardHeader><CardTitle>Confirmar Exclusão</CardTitle></CardHeader>
        <CardContent><p>Tem certeza que deseja apagar esta sessão? Esta ação não pode ser desfeita.</p></CardContent>
        <div className="flex justify-end p-6 pt-0 space-x-2">
          <Button variant="ghost" onClick={() => setIsDeleteConfirmOpen(false)}>Cancelar</Button>
          <Button variant="destructive" onClick={handleDeleteConfirm}>Apagar</Button>
        </div>
      </Dialog>
    </main>
  );
}