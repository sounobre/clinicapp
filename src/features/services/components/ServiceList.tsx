import  { Button } from "@/components/ui/button";
import  { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import  { TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { PlusCircle, Table, Pencil, Trash2 } from "lucide-react";
import type { Service } from "../schemas";

// src/features/services/components/ServiceList.tsx
interface ServiceListProps { services: Service[]; onEdit: (service: Service) => void; onDelete: (service: Service) => void; setActiveView: (view: string) => void; }
export function ServiceList({ services, onEdit, onDelete, setActiveView }: ServiceListProps) {
    return ( 
    <Card> 
        <CardHeader className="border-b border-border"> 
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between"> 
                <div> <CardTitle>Lista de Serviços</CardTitle> <CardDescription>Gerencie os serviços oferecidos.</CardDescription> </div> 
                <Button onClick={() => setActiveView('serviceForm')}> <PlusCircle className="mr-2 h-4 w-4" /> Novo Serviço </Button> 
            </div> 
        </CardHeader> 
        <CardContent className="p-0"> 
            <Table> 
                <TableHeader><TableRow><TableHead>Serviço</TableHead><TableHead>Preço</TableHead><TableHead className="hidden sm:table-cell">Duração</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader> 
                <TableBody>
                    {services.map((service) => ( 
                        <TableRow key={service.id}> 
                            <TableCell className="font-medium">{service.name}</TableCell> 
                            <TableCell className="text-muted-foreground">R$ {service.price}</TableCell> 
                            <TableCell className="hidden sm:table-cell text-muted-foreground">{service.duration}</TableCell> 
                            <TableCell className="text-right"> 
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(service)}> <Pencil className="h-4 w-4" /> </Button> 
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => onDelete(service)}> <Trash2 className="h-4 w-4" /> </Button> 
                            </TableCell> 
                        </TableRow> 
                    ))} 
                </TableBody> 
            </Table> 
        </CardContent> 
    </Card> 
    ); 
}