// Caminho: src/services/patientService.ts
import api from './api';
import { Client } from '@/types';

// Busca pacientes no backend e garante um formato consistente de retorno.
// Alguns backends podem retornar um array diretamente enquanto outros
// utilizam um objeto com as propriedades `data` e `total`.
export const getPatients = async (
  page: number,
  limit: number,
  searchTerm: string
): Promise<{ data: Client[]; total: number }> => {
  const response = await api.get('/patients', {
    params: {
      page,
      limit,
      search: searchTerm,
    },
  });

  const respData = response.data;

  // Se a API retorna um array simples de pacientes
  if (Array.isArray(respData)) {
    return { data: respData, total: respData.length };
  }

  // Caso contrário, assume-se que já possui a estrutura { data, total }
  return {
    data: respData.data ?? [],
    total: respData.total ?? respData.data?.length ?? 0,
  };
};

export const getPatientById = async (id: number): Promise<Client> => {
  const response = await api.get(`/patients/${id}`);
  return response.data;
};

export const createPatient = async (patientData: Omit<Client, 'id' | 'status'>): Promise<Client> => {
  const response = await api.post('/patients', patientData);
  return response.data;
};

export const updatePatient = async (id: number, patientData: Partial<Client>): Promise<Client> => {
  const response = await api.put(`/patients/${id}`, patientData);
  return response.data;
};

export const deletePatient = async (id: number): Promise<void> => {
  await api.delete(`/patients/${id}`);
};