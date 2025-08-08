import  { Button } from "@/components/ui/button";
import  { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

interface SaleSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    total: number;
}

export function SaleSuccessModal({isOpen, onClose, total}: SaleSuccessModalProps) {
    if (!isOpen) return null;
    return (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"><Card
        className="w-full max-w-md text-center"> <CardHeader>
        <div
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
            <CheckCircle className="h-10 w-10 text-emerald-500"/></div>
        <CardTitle className="mt-4">Venda Finalizada!</CardTitle> </CardHeader> <CardContent><p
        className="text-muted-foreground">A venda no valor de <span
        className="font-bold text-foreground">R$ {total.toFixed(2)}</span> foi concluída com sucesso.</p></CardContent>
        <CardFooter className="justify-center"> <Button onClick={onClose}>Fechar</Button> </CardFooter> </Card></div>);
}
