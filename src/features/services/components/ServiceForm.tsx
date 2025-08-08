import  { Button } from "@/components/ui/button";
import  { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import  { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import  { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Form } from "react-hook-form";
import { type Service, type ServiceSchema, serviceSchema } from "../schemas";

// src/features/services/components/ServiceForm.tsx
interface ServiceFormProps { setActiveView: (view: string) => void; onSave: (service: Service) => void; serviceToEdit: Service | null; }
export function ServiceForm({ setActiveView, onSave, serviceToEdit }: ServiceFormProps) {
    const form = useForm<ServiceSchema>({
        resolver: zodResolver(serviceSchema),
        defaultValues: serviceToEdit || { name: "", price: "", duration: "" },
    });

    const handleSubmit = (data: ServiceSchema) => {
        onSave({ ...data, id: serviceToEdit ? serviceToEdit.id : Date.now() });
    };

    return ( 
    <Card> 
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <CardHeader> <CardTitle>{serviceToEdit ? 'Editar Serviço' : 'Cadastrar Novo Serviço'}</CardTitle> <CardDescription>Preencha os dados abaixo.</CardDescription> </CardHeader> 
                <CardContent className="space-y-4"> 
                    <FormField name="name" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nome do Serviço</FormLabel>
                            <FormControl><Input placeholder="Ex: Corte Degradê" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField name="price" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Preço (R$)</FormLabel>
                            <FormControl><Input type="number" step="0.01" placeholder="Ex: 40.00" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField name="duration" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Duração</FormLabel>
                            <FormControl><Input placeholder="Ex: 45 min" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </CardContent> 
                <CardFooter className="gap-2"> <Button type="submit">Salvar</Button> <Button variant="outline" type="button" onClick={() => setActiveView('listServices')}>Cancelar</Button> </CardFooter> 
            </form>
        </Form>
    </Card> 
    ); 
}