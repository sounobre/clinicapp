// Caminho: src/pages/ProntuariosPage.tsx
import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import type { Client } from "@/types";
// import { getClients } from '@/services/patientService';

interface ProntuariosPageProps {
  onClientSelect: (clientId: number) => void;
}

export function ProntuariosPage({ onClientSelect }: ProntuariosPageProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // const clientsData = await getClients(); // Chamada de API real
        // setClients(clientsData);

        // Simulação com dados mocados
        const mockClients: Client[] = [
          {
            id: 1,
            name: "Ana Pereira",
            email: "ana.p@example.com",
            phone: "(21) 99999-8888",
            status: "Ativo",
            nome_completo: "Ana Pereira da Silva",
            cpf: "111.222.333-44",
            data_nascimento: "1990-05-15",
            consentimento_lgpd: true,
          },
        ];
        setClients(mockClients);
      } catch (err) {
        setError("Não foi possível carregar os prontuários. Tente novamente.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

  if (isLoading) return <div className="p-6">Carregando prontuários...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <main className="p-6">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">
        Prontuários
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {clients.map((client) => (
          <Card
            key={client.id}
            className="cursor-pointer hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-500 transition-shadow"
            onClick={() => onClientSelect(client.id)}
          >
            <CardHeader>
              <CardTitle>{client.name}</CardTitle>
              <CardDescription>{client.email}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </main>
  );
}
