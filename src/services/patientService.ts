// Caminho: src/services/patientService.ts
import api from './api';
import { Client } from '@/types';

// Converte o objeto recebido do backend (camelCase) para o formato utilizado no frontend (snake_case)
const fromDTO = (dto: any): Client => ({
  id: dto.id,
  name: dto.nomeCompleto,
  email: dto.emailPrincipal,
  phone: dto.telefonePrincipal,
  status: dto.status,
  nome_completo: dto.nomeCompleto,
  cpf: dto.cpf,
  data_nascimento: dto.dataNascimento,
  nome_social: dto.nomeSocial,
  genero: dto.genero,
  pronomes: dto.pronomes,
  rg: dto.rg,
  endereco_cep: dto.enderecoCep,
  endereco_rua: dto.enderecoRua,
  endereco_numero: dto.enderecoNumero,
  endereco_complemento: dto.enderecoComplemento,
  endereco_bairro: dto.enderecoBairro,
  endereco_cidade: dto.enderecoCidade,
  endereco_estado: dto.enderecoEstado,
  contato_emergencia_nome: dto.contatoEmergenciaNome,
  contato_emergencia_parentesco: dto.contatoEmergenciaParentesco,
  contato_emergencia_telefone: dto.contatoEmergenciaTelefone,
  como_conheceu: dto.comoConheceu,
  campo_observacoes_iniciais: dto.campoObservacoesIniciais,
  telefone_principal: dto.telefonePrincipal,
  email_principal: dto.emailPrincipal,
  consentimento_lgpd: dto.consentimentoLgpd,
});

// Converte o objeto do formulário (snake_case) para o formato esperado pelo backend (camelCase)
type ClientPayload = Omit<Client, 'id' | 'name' | 'email' | 'phone' | 'status'> & {
  status?: Client['status'];
};

const toDTO = (client: Partial<ClientPayload>) => {
  const dto: any = {
    nomeCompleto: client.nome_completo,
    cpf: client.cpf,
    dataNascimento: client.data_nascimento,
    nomeSocial: client.nome_social,
    genero: client.genero,
    pronomes: client.pronomes,
    rg: client.rg,
    enderecoCep: client.endereco_cep,
    enderecoRua: client.endereco_rua,
    enderecoNumero: client.endereco_numero,
    enderecoComplemento: client.endereco_complemento,
    enderecoBairro: client.endereco_bairro,
    enderecoCidade: client.endereco_cidade,
    enderecoEstado: client.endereco_estado,
    contatoEmergenciaNome: client.contato_emergencia_nome,
    contatoEmergenciaParentesco: client.contato_emergencia_parentesco,
    contatoEmergenciaTelefone: client.contato_emergencia_telefone,
    comoConheceu: client.como_conheceu,
    campoObservacoesIniciais: client.campo_observacoes_iniciais,
    telefonePrincipal: client.telefone_principal,
    emailPrincipal: client.email_principal,
    consentimentoLgpd: client.consentimento_lgpd,
    status: client.status,
  };
  Object.keys(dto).forEach(key => dto[key] === undefined && delete dto[key]);
  return dto;
};

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
    return { data: respData.map(fromDTO), total: respData.length };
  }

  // Caso contrário, assume-se que já possui a estrutura { data, total }
  return {
    data: (respData.data ?? []).map(fromDTO),
    total: respData.total ?? respData.data?.length ?? 0,
  };
};

export const getPatientById = async (id: number): Promise<Client> => {
  const response = await api.get(`/patients/${id}`);
  return fromDTO(response.data);
};

export const createPatient = async (patientData: ClientPayload): Promise<Client> => {
  const response = await api.post('/patients', toDTO(patientData));
  return fromDTO(response.data);
};

export const updatePatient = async (id: number, patientData: Partial<ClientPayload>): Promise<Client> => {
  const response = await api.put(`/patients/${id}`, toDTO(patientData));
  return fromDTO(response.data);
};

export const deletePatient = async (id: number): Promise<void> => {
  await api.delete(`/patients/${id}`);
};