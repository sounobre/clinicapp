import  { Button } from "@/components/ui/button";
import  { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import  { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import  { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Form } from "react-hook-form";
import { type Client, type ClientSchema, clientSchema } from "../schemas";

// src/features/clients/components/ClientForm.tsx
interface ClientFormProps { setActiveView: (view: string) => void; onSave: (client: Client) => void; clientToEdit: Client | null; }
export function ClientForm({ setActiveView, onSave, clientToEdit }: ClientFormProps) {
    const form = useForm<ClientSchema>({
        resolver: zodResolver(clientSchema),
        defaultValues: clientToEdit || { name: "", email: "", phone: "" },
    });

    const handleSubmit = (data: ClientSchema) => {
        onSave({ ...data, id: clientToEdit ? clientToEdit.id : Date.now() });
    };

    return (
        <Card>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <CardHeader>
                        <CardTitle>{clientToEdit ? 'Editar Cliente' : 'Cadastrar Novo Cliente'}</CardTitle>
                        <CardDescription>Preencha os dados abaixo.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nome Completo</FormLabel>
                                <FormControl><Input placeholder="Ex: Carlos Silva" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField name="email" render={({ field }) => (
                            <FormItem>
                                <FormLabel>E-mail</FormLabel>
                                <FormControl><Input placeholder="Ex: email@example.com" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField name="phone" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Telefone</FormLabel>
                                <FormControl><Input placeholder="Ex: (11) 98765-4321" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </CardContent>
                    <CardFooter className="gap-2">
                        <Button type="submit">Salvar</Button>
                        <Button variant="outline" type="button" onClick={() => setActiveView('listClients')}>Cancelar</Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}