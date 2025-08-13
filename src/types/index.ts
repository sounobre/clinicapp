// Caminho: src/types/index.ts
export type Role = 'admin' | 'medico' | 'funcionario';
export type Plan = 'plano1' | 'plano2' | 'plano3';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  plan: Plan;
}

export interface Client {
  id: number;
  name: string; // Mapeado de nome_completo para consistência
  email: string; // Mapeado de email_principal
  phone: string; // Mapeado de telefone_principal
  status: 'Ativo' | 'Inativo';
  // Todos os outros campos do formulário
  nome_completo: string;
  cpf: string;
  data_nascimento: string;
  consentimento_lgpd: boolean;
  // Adicione outros campos conforme necessário
  [key: string]: any;
}

export interface Session {
  id: number;
  pacienteId: number;
  data_sessao: string;
  hora_inicio: string;
  duracao_minutos: number;
  titulo_sessao: string;
  notas_agendamento?: string;
  notas_internas?: string;
  tipo_sessao: 'Presencial' | 'Online';
  status_sessao: 'Confirmada' | 'Pendente' | 'Realizada' | 'Cancelada' | 'Faltou';
  valor_sessao: number;
  recorrencia: 'Nao se repete' | 'Semanalmente' | 'Quinzenalmente' | 'Mensalmente';
  // Adicione outros campos conforme necessário
  [key: string]: any;
}

export interface Service {
  id: number;
  name: string;
  duration: number;
  price: number;
}

export interface Expense {
    id: number;
    descricao_despesa: string;
    categoria_despesa: string;
    valor_despesa: number;
    data_vencimento: string;
    data_pagamento?: string;
    status_pagamento: 'Pago' | 'Pendente';
}