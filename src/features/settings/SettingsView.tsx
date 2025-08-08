import  { Button } from "@/components/ui/button";
import  { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";


export function SettingsView() {
    return ( 
    <div className="space-y-6"> 
        <div> <h2 className="text-2xl font-bold tracking-tight">Configurações</h2> <p className="text-muted-foreground">Gerencie as configurações da sua conta e do sistema.</p> </div> 
        <Card> 
            <CardHeader> <CardTitle>Geral</CardTitle> <CardDescription>Configurações gerais da aplicação.</CardDescription> </CardHeader> 
            <CardContent className="space-y-4"> 
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary"> <div> <Label>Modo Escuro</Label> <p className="text-xs text-muted-foreground">Ative para uma experiência visual com menos brilho.</p> </div> <Button size="sm">Ativar</Button> </div> 
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary"> <div> <Label>Idioma</Label> <p className="text-xs text-muted-foreground">Selecione o idioma da interface.</p> </div> <Button variant="outline" size="sm">Português (Brasil)</Button> </div> 
            </CardContent> 
        </Card> 
        <Card> 
            <CardHeader> <CardTitle>Notificações</CardTitle> <CardDescription>Escolha como você quer ser notificado.</CardDescription> </CardHeader> 
            <CardContent className="space-y-4"> 
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary"> <Label>Notificações por Email</Label> <Button size="sm">Ativado</Button> </div> 
                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary"> <Label>Notificações Push</Label> <Button size="sm" variant="outline">Desativado</Button> </div> 
            </CardContent> 
        </Card> 
    </div> 
    ); 
}