// Caminho: src/components/modals/ProfileModal.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, User, ImageIcon } from 'lucide-react';

import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { passwordSchema } from '@/schemas';

type PasswordFormData = z.infer<typeof passwordSchema>;

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
}

export function ProfileModal({ open, onClose }: ProfileModalProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema)
  });

  const onPasswordChange = (data: PasswordFormData) => {
    console.log("Password change data:", data);
    // TODO: Adicionar a lógica para chamar o serviço de API que troca a senha
    // Ex: await authService.changePassword(data);
    alert("Senha alterada com sucesso! (simulação)");
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} size="2xl">
      <CardHeader>
        <CardTitle>Meu Perfil</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-3 right-3 h-8 w-8 rounded-full">
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>
      <div className="-mt-6">
        <Tabs defaultValue="personal">
          <div className="px-6">
            <TabsList>
              <TabsTrigger value="personal">Dados Pessoais</TabsTrigger>
              <TabsTrigger value="security">Segurança</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="personal">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-24 h-24 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-slate-400" />
                </div>
                <label htmlFor="photo-upload" className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700">
                  <ImageIcon className="w-4 h-4" />
                  <input id="photo-upload" type="file" className="sr-only" />
                </label>
              </div>
              <div className="text-center">
                <h4 className="text-lg font-semibold dark:text-slate-100">Dr. Silva</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">dr.silva@psicoapp.com</p>
              </div>
              <Button variant="ghost">Trocar Foto</Button>
            </div>
          </TabsContent>
          <TabsContent value="security">
            <form onSubmit={handleSubmit(onPasswordChange)} className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Senha Atual</Label>
                <Input id="currentPassword" type="password" {...register("currentPassword")} />
                {errors.currentPassword && <p className="text-sm text-red-500 mt-1">{errors.currentPassword.message}</p>}
              </div>
              <div>
                <Label htmlFor="newPassword">Nova Senha</Label>
                <Input id="newPassword" type="password" {...register("newPassword")} />
                {errors.newPassword && <p className="text-sm text-red-500 mt-1">{errors.newPassword.message}</p>}
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
                {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>}
              </div>
              <div className="flex justify-end pt-4">
                <Button type="submit">Salvar Alterações</Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </Dialog>
  );
}