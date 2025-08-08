import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import  { Button } from "@/components/ui/button";
import  { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import  { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";



// src/features/profile/ProfileView.tsx
export function ProfileView() {
    return ( 
    <Card> 
        <CardHeader> <CardTitle>Perfil do Usuário</CardTitle> <CardDescription>Atualize suas informações pessoais e foto.</CardDescription> </CardHeader> 
        <CardContent className="space-y-6"> 
            <div className="flex items-center gap-6"> <Avatar className="h-20 w-20"> <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" /> <AvatarFallback>BB</AvatarFallback> </Avatar> <Button variant="outline">Alterar Foto</Button> </div> 
            <div className="grid md:grid-cols-2 gap-4"> 
                <div className="space-y-2"> <Label htmlFor="name">Nome</Label> <Input id="name" defaultValue="Seu Nome de Barbeiro" /> </div> 
                <div className="space-y-2"> <Label htmlFor="email">Email</Label> <Input id="email" type="email" defaultValue="barbeiro@email.com" /> </div> 
            </div> 
        </CardContent> 
        <CardFooter> <Button>Salvar Alterações</Button> </CardFooter> 
    </Card> 
    ); 
}