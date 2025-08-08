import  { Button } from "@/components/ui/button";
import  { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import  { TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { PlusCircle, Table, Pencil, Trash2 } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import type { UserType, Role } from "./schemas";

interface AdminViewProps {
    users: UserType[];
    onEdit: (user: UserType) => void;
    onDelete: (user: UserType) => void;
    setActiveView: (view: string) => void;
    setCurrentViewRole: Dispatch<SetStateAction<Role | null>>;
}

export function AdminView({users, onEdit, onDelete, setActiveView, setCurrentViewRole}: AdminViewProps) {
    return (
        <div className="space-y-8">
            <Card>
                <CardHeader> <CardTitle>Mudar Visualização</CardTitle> <CardDescription>Simule a visão de outros perfis
                    de usuário no sistema.</CardDescription> </CardHeader>
                <CardContent className="flex flex-col sm:flex-row gap-4">
                    <Button className="w-full" onClick={() => setCurrentViewRole('Funcionário')}>Ver como
                        Funcionário</Button>
                    <Button className="w-full" onClick={() => setCurrentViewRole('Cliente')}>Ver como Cliente</Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="border-b border-border/50">
                    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div><CardTitle>Gerenciamento de Usuários</CardTitle> <CardDescription>Adicione, edite ou remova
                            usuários do sistema.</CardDescription></div>
                        <Button onClick={() => setActiveView('userForm')}><PlusCircle className="mr-2 h-4 w-4"/> Novo
                            Usuário</Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader><TableRow><TableHead>Nome</TableHead><TableHead>Email</TableHead><TableHead>Perfil</TableHead><TableHead
                            className="text-right">Ações</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {users.map(user => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                                    <TableCell className="text-muted-foreground">{user.role}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" className="h-8 w-8"
                                                onClick={() => onEdit(user)}><Pencil className="h-4 w-4"/></Button>
                                        <Button variant="ghost" size="icon"
                                                className="h-8 w-8 text-destructive hover:text-destructive"
                                                onClick={() => onDelete(user)}><Trash2 className="h-4 w-4"/></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
