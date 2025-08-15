// Caminho: src/pages/PacienteDetalhesPage.tsx
import { useState, useEffect, useCallback, useMemo } from 'react';
import { ArrowLeft, Plus, Edit } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { SessionModal } from '@/components/modals/SessionModal';
import type { Session, Client, User } from '@/types';

// import { getPatientById } from '@/services/patientService';
// import { getSessionsByPatientId, saveSession } from '@/services/sessionService';

interface PacienteDetalhesPageProps {
  clientId: number;
  onBack: () => void;
  currentUser: User;
}

export function PacienteDetalhesPage({ clientId, onBack, currentUser }: PacienteDetalhesPageProps) {
  const [client, setClient] = useState<Client | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Session | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Chamadas de API reais
      // const [clientData, sessionsData] = await Promise.all([
      //   getPatientById(clientId),
      //   getSessionsByPatientId(clientId)
      // ]);
      // setClient(clientData);
      // setSessions(sessionsData);

      // Simulação
      const mockClient: Client = { id: clientId, name: 'Ana Pereira', email: 'ana.p@example.com', phone: '(21) 99999-8888', status: 'Ativo', nome_completo: 'Ana Pereira da Silva', cpf: '111.222.333-44', data_nascimento: '1990-05-15', consentimento_lgpd: true };
      const mockSessions: Session[] = [{id: 1, pacienteId: clientId, data_sessao: "2025-08-11", hora_inicio: "14:00", duracao_minutos: 50, titulo_sessao: "Consulta Ana P.", notas_agendamento: "Consulta de rotina.", notas_internas: "Paciente apresentou-se calmo e colaborativo.", tipo_sessao: "Online", status_sessao: "Realizada", valor_sessao: 150, recorrencia: "Nao se repete"}];
      setClient(mockClient);
      setSessions(mockSessions);

    } catch (err) {
      setError("Não foi possível carregar os dados do paciente.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSaveSession = async (data: any) => {
    // Adiciona o ID do paciente fixo aos dados da sessão antes de salvar
    const sessionPayload = { ...data, pacienteId: clientId };
    try {
        // await saveSession(sessionPayload); // Lógica de API para salvar
        alert(`Sessão "${sessionPayload.titulo_sessao}" salva com sucesso! (Simulação)`);
        fetchData(); // Re-busca os dados para atualizar
        closeModal();
    } catch(err) {
        alert("Erro ao salvar sessão!");
        console.error(err);
    }
  };

  const historyItems = useMemo(() => {
    return sessions
      .map(s => ({
        ...s,
        date: new Date(`${s.data_sessao.replace(/-/g, '\/')}T${s.hora_inicio}`),
      }))
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [sessions]);

  const closeModal = () => { setIsModalOpen(false); setEditingItem(null); };
  const openModalForNew = () => { setEditingItem(null); setIsModalOpen(true); };
  const openModalForEdit = (item: Session) => { setEditingItem(item); setIsModalOpen(true); };

  if (isLoading) return <div className="p-6">Carregando dados do paciente...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!client) return <div className="p-6">Paciente não encontrado.</div>;

  return (
    <main className="p-6">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Prontuários
      </Button>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader><CardTitle>{client.name}</CardTitle><CardDescription>{client.email}</CardDescription></CardHeader>
            <CardContent><p className="text-sm text-slate-600 dark:text-slate-400">{client.phone}</p></CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Histórico de Sessões</h3>
            <Button onClick={openModalForNew}><Plus className="mr-2 h-4 w-4" /> Registrar Nova Sessão</Button>
          </div>
            <div className="space-y-4">
              {historyItems.map((item: any) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">{item.titulo_sessao || "Sessão"}</CardTitle>
                      <CardDescription>{item.date.toLocaleDateString('pt-BR')} - {item.hora_inicio}</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" onClick={() => openModalForEdit(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {item.notas_agendamento && (
                    <div>
                      <Label className="text-xs text-slate-400 font-semibold">NOTAS DO AGENDAMENTO</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-300 pt-1">{item.notas_agendamento}</p>
                    </div>
                  )}
                  {item.notas_internas && (
                    <div>
                      <Label className="text-xs text-slate-400 font-semibold">EVOLUÇÃO DA SESSÃO</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400 pt-1 italic border-l-2 border-slate-300 dark:border-slate-600 pl-3">
                        {item.notas_internas.substring(0, 150)}{item.notas_internas.length > 150 ? '...' : ''}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <SessionModal
        open={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveSession}
        userRole={currentUser.role}
        clients={[client]} // Passa apenas o cliente atual para o modal
        editingData={editingItem}
      />
    </main>
  );
}