// Caminho: src/schemas/index.ts
import { z } from 'zod';

export const sessionSchema = z.object({
  pacienteId: z.string().min(1, "O paciente é obrigatório."),
  titulo_sessao: z.string().min(3, "O título é obrigatório."),
  data_sessao: z.string().refine(val => !isNaN(Date.parse(val)), "Data inválida."),
  hora_inicio: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido (HH:MM)."),
  duracao_minutos: z.coerce.number().positive("Duração deve ser positiva.").default(50),
  tipo_sessao: z.enum(['Presencial', 'Online']),
  status_sessao: z.enum(['Confirmada', 'Pendente', 'Realizada', 'Cancelada', 'Faltou']),
  valor_sessao: z.coerce.number().nonnegative("O valor não pode ser negativo."),
  status_pagamento: z.enum(['Pendente', 'Pago', 'Vencido', 'Isento']).optional(),
  data_recebimento: z.string().optional(),
  forma_recebimento: z.enum(['Pix', 'Dinheiro', 'Transferência', 'Cartão de Crédito']).optional(),
  recorrencia: z.enum(['Nao se repete', 'Semanalmente', 'Quinzenalmente', 'Mensalmente']),
  recorrencia_data_fim: z.string().optional(),
  notas_agendamento: z.string().optional(),
  notas_internas: z.string().optional(),
  anexos: z.any().optional(),
}).refine(data => {
    if (data.recorrencia !== 'Nao se repete' && !data.recorrencia_data_fim) {
        return false;
    }
    return true;
}, {
    message: "A data de término é obrigatória para sessões recorrentes.",
    path: ["recorrencia_data_fim"],
});

export const clientSchema = z.object({
  nome_completo: z.string().min(3, "O nome é obrigatório."),
  cpf: z.string().min(11, "CPF deve ter 11 dígitos.").max(14, "CPF deve ter 11 dígitos."),
  data_nascimento: z.string().refine(val => !isNaN(Date.parse(val)), "Data inválida."),
  nome_social: z.string().optional(),
  genero: z.string().optional(),
  pronomes: z.string().optional(),
  rg: z.string().optional(),
  telefone_principal: z.string().min(10, "Telefone inválido."),
  email_principal: z.string().email("Email inválido."),
  endereco_cep: z.string().optional(),
  endereco_rua: z.string().optional(),
  endereco_numero: z.string().optional(),
  endereco_complemento: z.string().optional(),
  endereco_bairro: z.string().optional(),
  endereco_cidade: z.string().optional(),
  endereco_estado: z.string().optional(),
  contato_emergencia_nome: z.string().optional(),
  contato_emergencia_parentesco: z.string().optional(),
  contato_emergencia_telefone: z.string().optional(),
  como_conheceu: z.string().optional(),
  campo_observacoes_iniciais: z.string().optional(),
  consentimento_lgpd: z.boolean().refine(val => val === true, { message: "O consentimento é obrigatório." }),
});

export const serviceSchema = z.object({
  name: z.string().min(3, "O nome do serviço é obrigatório."),
  duration: z.coerce.number().min(1, "Duração deve ser maior que 0."),
  price: z.coerce.number().min(1, "Preço deve ser maior que 0."),
});

export const expenseSchema = z.object({
    descricao_despesa: z.string().min(3, "A descrição é obrigatória."),
    categoria_despesa: z.string().min(1, "A categoria é obrigatória."),
    valor_despesa: z.coerce.number().positive("O valor deve ser positivo."),
    data_vencimento: z.string().refine(val => !isNaN(Date.parse(val)), "Data inválida."),
    data_pagamento: z.string().optional(),
    status_pagamento: z.enum(['Pago', 'Pendente']),
    anexo_comprovante: z.any().optional(),
});

export const profileSchema = z.object({
    nome_completo_profissional: z.string().min(3, "Nome completo é obrigatório."),
    cpf_cnpj_profissional: z.string().min(11, "Documento inválido."),
    crp_profissional: z.string().min(5, "CRP inválido."),
    endereco_profissional_completo: z.string().min(10, "Endereço é obrigatório."),
    logo_profissional: z.any().optional(),
    inscricao_municipal_nf: z.string().optional(),
});

export const clinicSchema = z.object({
    nome_clinica: z.string().min(3, "Nome da clínica é obrigatório."),
    cnpj_clinica: z.string().min(14, "CNPJ inválido."),
    endereco_clinica: z.string().min(10, "Endereço é obrigatório."),
    telefone_clinica: z.string().min(10, "Telefone inválido."),
    email_clinica: z.string().email("Email inválido."),
    website_clinica: z.string().url("URL inválida.").optional().or(z.literal('')),
});

export const passwordSchema = z.object({
    currentPassword: z.string().min(1, "Senha atual é obrigatória."),
    newPassword: z.string().min(6, "A nova senha deve ter pelo menos 6 caracteres."),
    confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
});