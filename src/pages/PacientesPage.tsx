// Caminho: src/pages/PacientesPage.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { clientSchema } from '@/schemas';
import { getPatients, createPatient, updatePatient, deletePatient } from '@/services/patientService';
import type { Client } from '@/types';

type ClientFormData = z.infer<typeof clientSchema>;

const ITEMS_PER_PAGE = 5;

export function PacientesPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const [deletingClientId, setDeletingClientId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const { register, handleSubmit, formState: { errors }, reset, control, setValue } = useForm<ClientFormData>({
        resolver: zodResolver(clientSchema)
    });

    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    const fetchClients = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Em uma aplicação real, a API retornaria os dados paginados e filtrados
            // const response = await getPatients(currentPage, ITEMS_PER_PAGE, searchTerm);
            // setClients(response.data);
            // setTotalItems(response.total);

            // Simulação para fins de desenvolvimento
            const mockClients: Client[] = [
                { id: 1, name: 'Ana Pereira', email: 'ana.p@example.com', phone: '(21) 99999-8888', status: 'Ativo', nome_completo: 'Ana Pereira da Silva', cpf: '111.222.333-44', data_nascimento: '1990-05-15', consentimento_lgpd: true },
                { id: 2, name: 'João Santos', email: 'joao.s@example.com', phone: '(22) 98888-7777', status: 'Ativo', nome_completo: 'João Santos de Souza', cpf: '222.333.444-55', data_nascimento: '1985-10-20', consentimento_lgpd: true },
                { id: 3, name: 'Carla Lima', email: 'carla.l@example.com', phone: '(11) 97777-6666', status: 'Ativo', nome_completo: 'Carla Lima Azevedo', cpf: '333.444.555-66', data_nascimento: '1992-02-25', consentimento_lgpd: true },
            ];
            const filtered = mockClients.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
            setClients(filtered);
            setTotalItems(filtered.length);

        } catch (err) {
            setError("Falha ao buscar pacientes. Tente novamente mais tarde.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, searchTerm]);

    useEffect(() => {
        fetchClients();
    }, [fetchClients]);

    useEffect(() => {
        if (editingClient) {
            // Popula o formulário quando um cliente está sendo editado
            Object.keys(editingClient).forEach(key => {
                setValue(key as keyof ClientFormData, editingClient[key as keyof Client]);
            });
            setIsModalOpen(true);
        }
    }, [editingClient, setValue]);
    
    const handleSaveClient = async (data: ClientFormData) => {
        try {
            if (editingClient) {
                // await updatePatient(editingClient.id, { ...data, name: data.nome_completo, email: data.email_principal, phone: data.telefone_principal });
                alert(`Paciente ${data.nome_completo} atualizado! (Simulação)`);
            } else {
                // await createPatient({ ...data, name: data.nome_completo, email: data.email_principal, phone: data.telefone_principal });
                alert(`Paciente ${data.nome_completo} criado! (Simulação)`);
            }
            closeModal();
            fetchClients();
        } catch (err) {
            console.error("Erro ao salvar paciente:", err);
            alert("Ocorreu um erro ao salvar o paciente.");
        }
    };
    
    const handleDeleteClient = async () => {
        if (!deletingClientId) return;
        try {
            // await deletePatient(deletingClientId);
            alert(`Paciente com ID ${deletingClientId} deletado! (Simulação)`);
            setDeletingClientId(null);
            fetchClients();
        } catch (err) {
            console.error("Erro ao deletar paciente:", err);
            alert("Ocorreu um erro ao deletar o paciente.");
        }
    };
    
    const openModalForNew = () => { setEditingClient(null); reset({consentimento_lgpd: false}); setIsModalOpen(true); };
    const openModalForEdit = (client: Client) => setEditingClient(client);
    const closeModal = () => { setIsModalOpen(false); setEditingClient(null); reset(); };

    const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const handlePreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
    
    return (
        <main className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Pacientes</h2>
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <Search className="w-5 h-5 text-slate-400 absolute top-1/2 left-3 -translate-y-1/2" />
                        <Input type="text" placeholder="Pesquisar paciente..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    </div>
                    <Button variant="primary" onClick={openModalForNew}><Plus className="mr-2 h-4 w-4" /> Novo Paciente</Button>
                </div>
            </div>
            
            {isLoading && <p>Carregando pacientes...</p>}
            {error && <p className="text-red-500">{error}</p>}
            
            {!isLoading && !error && (
              <>
                <Card>
                    <CardContent className="!p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 dark:bg-slate-900/50">
                                    <tr>
                                        <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Nome</th>
                                        <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Email</th>
                                        <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Telefone</th>
                                        <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Status</th>
                                        <th className="p-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                    {clients.map(client => (
                                    <tr key={client.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                        <td className="p-4 font-medium">{client.name}</td>
                                        <td className="p-4 text-slate-600 dark:text-slate-400">{client.email}</td>
                                        <td className="p-4 text-slate-600 dark:text-slate-400">{client.phone}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${client.status === 'Ativo' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>
                                                {client.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openModalForEdit(client)}><Edit className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDeletingClientId(client.id)}><Trash2 className="h-4 w-4" /></Button>
                                        </td>
                                    </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
                <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                        Mostrando {clients.length} de {totalItems} pacientes
                    </span>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" onClick={handlePreviousPage} disabled={currentPage === 1}>Anterior</Button>
                        <span className="text-sm font-medium">Página {currentPage} de {totalPages || 1}</span>
                        <Button variant="outline" onClick={handleNextPage} disabled={currentPage === totalPages}>Próximo</Button>
                    </div>
                </div>
              </>
            )}

            <Dialog open={isModalOpen} onClose={closeModal} size="2xl">
                <form onSubmit={handleSubmit(handleSaveClient)}>
                    <CardHeader><CardTitle>{editingClient ? 'Editar Paciente' : 'Novo Paciente'}</CardTitle></CardHeader>
                    <div className="max-h-[70vh] overflow-y-auto -mt-6">
                        <Tabs defaultValue="pessoal">
                             <div className="px-6"><TabsList><TabsTrigger value="pessoal">Dados Pessoais</TabsTrigger><TabsTrigger value="contato">Contato</TabsTrigger><TabsTrigger value="adicionais">Informações Adicionais</TabsTrigger></TabsList></div>
                            <TabsContent value="pessoal">
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2"><Label htmlFor="nome_completo">Nome Completo</Label><Input id="nome_completo" {...register("nome_completo")} />{errors.nome_completo && <p className="text-sm text-red-500 mt-1">{errors.nome_completo.message}</p>}</div>
                                    <div><Label htmlFor="cpf">CPF</Label><Input id="cpf" {...register("cpf")} placeholder="000.000.000-00" />{errors.cpf && <p className="text-sm text-red-500 mt-1">{errors.cpf.message}</p>}</div>
                                    <div><Label htmlFor="rg">RG</Label><Input id="rg" {...register("rg")} /></div>
                                    <div><Label htmlFor="data_nascimento">Data de Nascimento</Label><Input id="data_nascimento" type="date" {...register("data_nascimento")} />{errors.data_nascimento && <p className="text-sm text-red-500 mt-1">{errors.data_nascimento.message}</p>}</div>
                                    <div><Label htmlFor="nome_social">Nome Social</Label><Input id="nome_social" {...register("nome_social")} /></div>
                                    <div><Label htmlFor="genero">Gênero</Label><select {...register("genero")} className="h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 dark:border-slate-700"><option>Prefiro não informar</option><option>Feminino</option><option>Masculino</option><option>Não-binário</option><option>Outro</option></select></div>
                                    <div><Label htmlFor="pronomes">Pronomes</Label><Input id="pronomes" {...register("pronomes")} /></div>
                                </div>
                            </TabsContent>
                            <TabsContent value="contato" className="p-6">
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div><Label htmlFor="telefone_principal">Telefone Principal</Label><Input id="telefone_principal" {...register("telefone_principal")} placeholder="(00) 90000-0000" />{errors.telefone_principal && <p className="text-sm text-red-500 mt-1">{errors.telefone_principal.message}</p>}</div>
                                    <div><Label htmlFor="email_principal">Email Principal</Label><Input id="email_principal" type="email" {...register("email_principal")} />{errors.email_principal && <p className="text-sm text-red-500 mt-1">{errors.email_principal.message}</p>}</div>
                                    <div className="md:col-span-2"><hr className="my-4 dark:border-slate-700"/></div>
                                    <div><Label htmlFor="endereco_cep">CEP</Label><Input id="endereco_cep" {...register("endereco_cep")} placeholder="00000-000" /></div>
                                    <div><Label htmlFor="endereco_rua">Rua</Label><Input id="endereco_rua" {...register("endereco_rua")} /></div>
                                    <div><Label htmlFor="endereco_numero">Número</Label><Input id="endereco_numero" {...register("endereco_numero")} /></div>
                                    <div><Label htmlFor="endereco_complemento">Complemento</Label><Input id="endereco_complemento" {...register("endereco_complemento")} /></div>
                                    <div><Label htmlFor="endereco_bairro">Bairro</Label><Input id="endereco_bairro" {...register("endereco_bairro")} /></div>
                                    <div><Label htmlFor="endereco_cidade">Cidade</Label><Input id="endereco_cidade" {...register("endereco_cidade")} /></div>
                                    <div><Label htmlFor="endereco_estado">Estado</Label><Input id="endereco_estado" {...register("endereco_estado")} /></div>
                                    <div className="md:col-span-2"><hr className="my-4 dark:border-slate-700"/></div>
                                    <div className="md:col-span-2"><h4 className="font-medium mb-2 dark:text-slate-200">Contato de Emergência</h4></div>
                                    <div><Label htmlFor="contato_emergencia_nome">Nome</Label><Input id="contato_emergencia_nome" {...register("contato_emergencia_nome")} /></div>
                                    <div><Label htmlFor="contato_emergencia_parentesco">Parentesco</Label><Input id="contato_emergencia_parentesco" {...register("contato_emergencia_parentesco")} /></div>
                                    <div><Label htmlFor="contato_emergencia_telefone">Telefone</Label><Input id="contato_emergencia_telefone" {...register("contato_emergencia_telefone")} /></div>
                                 </div>
                            </TabsContent>
                             <TabsContent value="adicionais">
                                 <div className="p-6 space-y-4">
                                    <div><Label htmlFor="como_conheceu">Como conheceu a clínica?</Label><select {...register("como_conheceu")} className="h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 dark:border-slate-700"><option>Indicação</option><option>Google</option><option>Instagram</option><option>Site</option><option>Outro</option></select></div>
                                    <div><Label htmlFor="campo_observacoes_iniciais">Observações Iniciais</Label><textarea {...register("campo_observacoes_iniciais")} className="min-h-[80px] w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 dark:border-slate-700" /></div>
                                    <div className="flex items-start space-x-2"><Controller name="consentimento_lgpd" control={control} render={({ field }) => <input type="checkbox" id="consentimento_lgpd" checked={field.value} onChange={field.onChange} className="h-4 w-4 mt-1" />} /><div className="grid gap-1.5 leading-none"><label htmlFor="consentimento_lgpd" className="text-sm font-medium">Eu concordo com os <a href="#" className="text-blue-600 dark:text-blue-400">termos de uso</a> e <a href="#" className="text-blue-600 dark:text-blue-400">política de privacidade</a>.</label>{errors.consentimento_lgpd && <p className="text-sm text-red-500">{errors.consentimento_lgpd.message}</p>}</div></div>
                                 </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                    <div className="flex justify-end p-6 pt-4 space-x-2"><Button variant="ghost" type="button" onClick={closeModal}>Cancelar</Button>
                    <Button variant="primary" type="submit">Salvar Paciente</Button></div>
                </form>
            </Dialog>
            <Dialog open={!!deletingClientId} onClose={() => setDeletingClientId(null)}>
                <CardHeader><CardTitle>Confirmar Exclusão</CardTitle></CardHeader>
                <CardContent><p>Tem certeza que deseja apagar este paciente? Esta ação não pode ser desfeita.</p></CardContent>
                <div className="flex justify-end p-6 pt-0 space-x-2"><Button variant="ghost" onClick={() => setDeletingClientId(null)}>Cancelar</Button><Button variant="destructive" onClick={handleDeleteClient}>Apagar</Button></div>
            </Dialog>
        </main>
    );
}