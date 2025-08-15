// Caminho: src/pages/DefinicoesPage.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ShieldCheck, Gem } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { User, Role, Plan } from '@/types';
import { profileSchema, clinicSchema } from '@/schemas';
import { z } from 'zod';
import type { Dispatch, SetStateAction } from 'react';

interface DefinicoesPageProps {
  currentUser: User;
  setCurrentUser: Dispatch<SetStateAction<User>>;
}

type ProfileFormData = z.infer<typeof profileSchema>;
type ClinicFormData = z.infer<typeof clinicSchema>;

export function DefinicoesPage({ currentUser, setCurrentUser }: DefinicoesPageProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({ resolver: zodResolver(profileSchema) });
  const { register: registerClinic, handleSubmit: handleSubmitClinic, formState: { errors: errorsClinic } } = useForm<ClinicFormData>({ resolver: zodResolver(clinicSchema) });

  const onSaveProfile = (data: ProfileFormData) => {
    console.log('Perfil salvo:', data);
  };

  const onSaveClinic = (data: ClinicFormData) => {
    console.log('Dados da clínica salvos:', data);
  };

  return (
    <main className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">Definições</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações</CardTitle>
              <CardDescription>Simule diferentes perfis de usuário e planos de assinatura para testar a visibilidade dos menus.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="role-select">Perfil do Usuário (Role)</Label>
                <div className="relative">
                  <ShieldCheck className="w-5 h-5 text-slate-400 absolute top-1/2 left-3 -translate-y-1/2" />
                  <select
                    id="role-select"
                    value={currentUser.role}
                    onChange={e => setCurrentUser({ ...currentUser, role: e.target.value as Role })}
                    className="w-full pl-10 h-10 rounded-md border border-slate-300 bg-transparent dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="funcionario">Funcionário</option>
                    <option value="medico">Médico</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan-select">Plano de Assinatura</Label>
                <div className="relative">
                  <Gem className="w-5 h-5 text-slate-400 absolute top-1/2 left-3 -translate-y-1/2" />
                  <select
                    id="plan-select"
                    value={currentUser.plan}
                    onChange={e => setCurrentUser({ ...currentUser, plan: e.target.value as Plan })}
                    className="w-full pl-10 h-10 rounded-md border border-slate-300 bg-transparent dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="plano1">Plano 1</option>
                    <option value="plano2">Plano 2</option>
                    <option value="plano3">Plano 3</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <form onSubmit={handleSubmitClinic(onSaveClinic)}>
              <CardHeader>
                <CardTitle>Minha Clínica</CardTitle>
                <CardDescription>Informações da clínica para recibos e documentos.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="nome_clinica">Nome da Clínica</Label>
                  <Input id="nome_clinica" {...registerClinic('nome_clinica')} />
                  {errorsClinic.nome_clinica && <p className="text-sm text-red-500 mt-1">{errorsClinic.nome_clinica.message}</p>}
                </div>
                <div>
                  <Label htmlFor="cnpj_clinica">CNPJ</Label>
                  <Input id="cnpj_clinica" {...registerClinic('cnpj_clinica')} />
                  {errorsClinic.cnpj_clinica && <p className="text-sm text-red-500 mt-1">{errorsClinic.cnpj_clinica.message}</p>}
                </div>
                <div>
                  <Label htmlFor="endereco_clinica">Endereço</Label>
                  <Input id="endereco_clinica" {...registerClinic('endereco_clinica')} />
                  {errorsClinic.endereco_clinica && <p className="text-sm text-red-500 mt-1">{errorsClinic.endereco_clinica.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="telefone_clinica">Telefone</Label>
                    <Input id="telefone_clinica" {...registerClinic('telefone_clinica')} />
                    {errorsClinic.telefone_clinica && <p className="text-sm text-red-500 mt-1">{errorsClinic.telefone_clinica.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email_clinica">Email</Label>
                    <Input id="email_clinica" type="email" {...registerClinic('email_clinica')} />
                    {errorsClinic.email_clinica && <p className="text-sm text-red-500 mt-1">{errorsClinic.email_clinica.message}</p>}
                  </div>
                </div>
                <div>
                  <Label htmlFor="website_clinica">Website</Label>
                  <Input id="website_clinica" {...registerClinic('website_clinica')} />
                  {errorsClinic.website_clinica && <p className="text-sm text-red-500 mt-1">{errorsClinic.website_clinica.message}</p>}
                </div>
              </CardContent>
              <div className="flex justify-end p-6 pt-2">
                <Button type="submit">Salvar Clínica</Button>
              </div>
            </form>
          </Card>
        </div>
        <Card>
          <form onSubmit={handleSubmit(onSaveProfile)}>
            <CardHeader>
              <CardTitle>Meu Perfil</CardTitle>
              <CardDescription>Dados profissionais para emissão de recibos e notas fiscais.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="nome_completo_profissional">Nome Completo</Label>
                <Input id="nome_completo_profissional" {...register('nome_completo_profissional')} />
                {errors.nome_completo_profissional && <p className="text-sm text-red-500 mt-1">{errors.nome_completo_profissional.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cpf_cnpj_profissional">CPF/CNPJ</Label>
                  <Input id="cpf_cnpj_profissional" {...register('cpf_cnpj_profissional')} />
                  {errors.cpf_cnpj_profissional && <p className="text-sm text-red-500 mt-1">{errors.cpf_cnpj_profissional.message}</p>}
                </div>
                <div>
                  <Label htmlFor="crp_profissional">CRP</Label>
                  <Input id="crp_profissional" {...register('crp_profissional')} />
                  {errors.crp_profissional && <p className="text-sm text-red-500 mt-1">{errors.crp_profissional.message}</p>}
                </div>
              </div>
              <div>
                <Label htmlFor="endereco_profissional_completo">Endereço Completo</Label>
                <textarea
                  id="endereco_profissional_completo"
                  {...register('endereco_profissional_completo')}
                  className="min-h-[80px] w-full p-2 bg-transparent focus:outline-none rounded-md border border-slate-300 dark:border-slate-700 mt-1"
                />
                {errors.endereco_profissional_completo && <p className="text-sm text-red-500 mt-1">{errors.endereco_profissional_completo.message}</p>}
              </div>
              <div>
                <Label htmlFor="inscricao_municipal_nf">Inscrição Municipal (NF)</Label>
                <Input id="inscricao_municipal_nf" {...register('inscricao_municipal_nf')} />
              </div>
              <div>
                <Label>Logo</Label>
                <div className="mt-1 flex items-center space-x-4">
                  <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-md" />
                  <Button type="button" variant="ghost">Carregar Imagem</Button>
                </div>
              </div>
            </CardContent>
            <div className="flex justify-end p-6 pt-2">
              <Button type="submit">Salvar Perfil</Button>
            </div>
          </form>
        </Card>
      </div>
    </main>
  );
}

