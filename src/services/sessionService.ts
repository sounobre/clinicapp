import api from './api';
import { Session } from '@/types';

export const getSessions = async (): Promise<Session[]> => {
  const response = await api.get('/sessions');
  return response.data;
};

export const getSessionsByPatientId = async (patientId: number): Promise<Session[]> => {
  const response = await api.get(`/patients/${patientId}/sessions`);
  return response.data;
};

export const createSession = async (sessionData: Omit<Session, 'id'>): Promise<Session> => {
  const response = await api.post('/sessions', sessionData);
  return response.data;
};

export const updateSession = async (id: number, sessionData: Partial<Session>): Promise<Session> => {
  const response = await api.put(`/sessions/${id}`, sessionData);
  return response.data;
};

export const deleteSession = async (id: number): Promise<void> => {
  await api.delete(`/sessions/${id}`);
};
