import  { Button } from "@/components/ui/button";
import  { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import  { TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { PlusCircle, Table, Pencil, Trash2 } from "lucide-react";
import type { Client } from "../schemas";

// src/features/clients/components/ClientList.tsx
interface ClientListProps { clients: Client[]; onEdit: (client: Client) => void; onDelete: (client: Client) => void; setActiveView: (view: string) => void; }
export function ClientList({ clients, onEdit, onDelete, setActiveView }: ClientListProps) {
    return ( 
    <Card> 
        <CardHeader className="border-b border-border/50"> 
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between"> 
                <div> 
                    <CardTitle>Lista de Clientes</CardTitle> 
                    <CardDescription>Gerencie os clientes da sua barbearia.</CardDescription> 
                </div> 
                <Button onClick={() => setActiveView('clientForm')}> 
                    <PlusCircle className="mr-2 h-4 w-4" /> Novo Cliente 
                </Button> 
            </div> 
        </CardHeader> 
        <CardContent className="p-0"> 
            <Table> 
                <TableHeader><TableRow><TableHead>Nome</TableHead><TableHead className="hidden sm:table-cell">Email</TableHead><TableHead className="hidden md:table-cell">Telefone</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader> 
                <TableBody>
                    {clients.map((client) => ( 
                        <TableRow key={client.id}> 
                            <TableCell className="font-medium">{client.name}</TableCell> 
                            <TableCell className="hidden sm:table-cell text-muted-foreground">{client.email}</TableCell> 
                            <TableCell className="hidden md:table-cell text-muted-foreground">{client.phone}</TableCell> 
                            <TableCell className="text-right"> 
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(client)}> 
                                    <Pencil className="h-4 w-4" /> 
                                </Button> 
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => onDelete(client)}> 
                                    <Trash2 className="h-4 w-4" /> 
                                </Button> 
                            </TableCell> 
                        </TableRow> 
                    ))} 
                </TableBody> 
            </Table> 
        </CardContent> 
    </Card> 
    ); 
}