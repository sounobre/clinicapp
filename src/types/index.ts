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
  dataSessao: string;
  horaInicio: string;
  duracaoMinutos: number;
  tituloSessao: string;
  notasAgendamento?: string;
  notasInternas?: string;
  tipoSessao: 'Presencial' | 'Online';
  statusSessao: 'Confirmada' | 'Pendente' | 'Realizada' | 'Cancelada' | 'Faltou';
  valorSessao: number;
  statusPagamento?: 'Pendente' | 'Pago' | 'Vencido' | 'Isento';
  dataRecebimento?: string;
  formaRecebimento?: 'Pix' | 'Dinheiro' | 'Transferência' | 'Cartão de Crédito';
  recorrencia: 'Nao se repete' | 'Semanalmente' | 'Quinzenalmente' | 'Mensalmente';
  recorrenciaDataFim?: string;
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