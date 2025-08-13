// Caminho: src/services/patientService.ts
import api from './api';
import { Client } from '@/types';

// O tipo 'any' aqui é um placeholder. O ideal é que o backend retorne um objeto de paginação
export const getPatients = async (page: number, limit: number, searchTerm: string): Promise<{ data: Client[], total: number }> => {
  const response = await api.get('/patients', {
    params: {
      page,
      limit,
      search: searchTerm,
    }
  });
  // Adapte a resposta conforme o que seu backend retorna.
  // Exemplo: return { data: response.data.clients, total: response.data.totalCount };
  return response.data; 
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