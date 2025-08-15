// Caminho: src/pages/ProntuariosPage.tsx
import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import type { Client } from "@/types";
import { getPatients } from '@/services/patientService';

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
        const response = await getPatients(1, 100, '');
        setClients(response.data);
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
