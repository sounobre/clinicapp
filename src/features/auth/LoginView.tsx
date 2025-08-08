import  { Button } from "@/components/ui/button";
import  { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import  { Input } from "@/components/ui/input";

import { Scissors } from "lucide-react";
import type { Role } from "../admin/schemas";
import { Label } from "@/components/ui/label";

// src/features/auth/LoginView.tsx
interface LoginViewProps { onLogin: (role: Role) => void; }
export function LoginView({ onLogin }: LoginViewProps) {
    return (
        <div className="flex items-center justify-center h-screen bg-sidebar">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <div className="inline-block mx-auto mb-4"> <Scissors className="h-12 w-12 text-primary" /> </div>
                    <CardTitle>Bem-vindo de volta!</CardTitle> <CardDescription>Entre com seu email para acessar o painel.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2"> <Label htmlFor="email">Email</Label> <Input id="email" type="email" placeholder="email@example.com" defaultValue="admin@barber.com" /> </div>
                    <div className="space-y-2"> <Label htmlFor="password">Senha</Label> <Input id="password" type="password" defaultValue="123456" /> </div>
                </CardContent>
                <CardFooter> <Button className="w-full" onClick={() => onLogin('Admin')}>Entrar</Button> </CardFooter>
            </Card>
        </div>
    );
}