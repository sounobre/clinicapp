import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useForm, Form } from "react-hook-form";
import { type UserType, type UserSchema, userSchema } from "../schemas";
import { zodResolver } from '@hookform/resolvers/zod';
import { Select } from "@/components/ui/select";

// src/features/admin/components/UserForm.tsx
interface UserFormProps { setActiveView: (view: string) => void; onSave: (user: UserType) => void; userToEdit: UserType | null; }
export function UserForm({ setActiveView, onSave, userToEdit }: UserFormProps) {
    const form = useForm<UserSchema>({
        resolver: zodResolver(userSchema),
        defaultValues: userToEdit || { name: "", email: "", role: "Funcionário" },
    });

    const handleSubmit = (data: UserSchema) => {
        onSave({ ...data, id: userToEdit ? userToEdit.id : Date.now() });
    };

    return (
        <Card>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <CardHeader> <CardTitle>{userToEdit ? 'Editar Usuário' : 'Cadastrar Novo Usuário'}</CardTitle> </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nome Completo</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField name="email" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl><Input type="email" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField name="role" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Perfil</FormLabel>
                                <FormControl>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <option className="bg-card text-foreground">Admin</option>
                                        <option className="bg-card text-foreground">Funcionário</option>
                                        <option className="bg-card text-foreground">Cliente</option>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </CardContent>
                    <CardFooter className="gap-2"> <Button type="submit">Salvar</Button> <Button variant="outline" type="button" onClick={() => setActiveView('adminPanel')}>Cancelar</Button> </CardFooter>
                </form>
            </Form>
        </Card>
    );
}