import  { Button } from "@/components/ui/button";
import  { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName: string;
}

export function DeleteConfirmationModal({isOpen, onClose, onConfirm, itemName}: DeleteConfirmationModalProps) {
    if (!isOpen) return null;
    return (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"><Card
        className="w-full max-w-md"> <CardHeader className="flex flex-row items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10"><AlertTriangle
            className="h-6 w-6 text-destructive"/></div>
        <div><CardTitle>Confirmar Exclusão</CardTitle> <CardDescription>Você tem certeza que deseja excluir
            "{itemName}"?</CardDescription></div>
    </CardHeader> <CardContent><p>Esta ação não pode ser desfeita.</p></CardContent> <CardFooter
        className="justify-end gap-2"> <Button variant="outline" onClick={onClose}>Cancelar</Button> <Button
        variant="destructive" onClick={onConfirm}>Excluir</Button> </CardFooter> </Card></div>);
}
