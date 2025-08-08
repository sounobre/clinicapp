import  { Button } from "@/components/ui/button";
import  { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

import { Scissors, MinusCircle, PlusCircle } from "lucide-react";
import { type Dispatch, type SetStateAction, useState, useMemo } from "react";
import  { Label } from "recharts";
import type { Service } from "../services/schemas";
import { Select } from "@/components/ui/select";

// src/features/pdv/PDVView.tsx
interface PDVViewProps { services: Service[]; onSaleComplete: (total: number) => void; cart: (Service & { quantity: number })[]; setCart: Dispatch<SetStateAction<(Service & { quantity: number })[]>>; }
export function PDVView({ services, onSaleComplete, cart, setCart }: PDVViewProps) {
    const [paymentMethod, setPaymentMethod] = useState('Dinheiro');
    const handleAddToCart = (service: Service) => {
        setCart(currentCart => {
            const existingItem = currentCart.find(item => item.id === service.id);
            if (existingItem) { return currentCart.map(item => item.id === service.id ? { ...item, quantity: item.quantity + 1 } : item); }
            return [...currentCart, { ...service, quantity: 1 }];
        });
    };
    const handleUpdateQuantity = (serviceId: number, amount: number) => {
        setCart(currentCart => {
            const item = currentCart.find(item => item.id === serviceId);
            if (item && item.quantity + amount < 1) { return currentCart.filter(i => i.id !== serviceId); }
            return currentCart.map(i => i.id === serviceId ? { ...i, quantity: i.quantity + amount } : i);
        });
    };
    const total = useMemo(() => {
        return cart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
    }, [cart]);
    const handleFinalizeSale = () => { if (cart.length === 0) return; onSaleComplete(total); setCart([]); };
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
            <div className="lg:col-span-2">
                <Card className="h-full">
                    <CardHeader> <CardTitle>Serviços</CardTitle> <CardDescription>Clique em um serviço para adicionar à venda.</CardDescription> </CardHeader>
                    <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {services.map(service => ( <button key={service.id} onClick={() => handleAddToCart(service)} className="aspect-square flex flex-col items-center justify-center p-4 rounded-lg bg-secondary hover:bg-accent transition-colors text-center"> <Scissors className="h-8 w-8 mb-2 text-primary" /> <p className="font-semibold text-sm">{service.name}</p> <p className="text-xs text-muted-foreground">R$ {service.price}</p> </button> ))}
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-1">
                <Card className="h-full flex flex-col">
                    <CardHeader> <CardTitle>Venda Atual</CardTitle> </CardHeader>
                    <CardContent className="flex-1 space-y-4 overflow-y-auto">
                        {cart.length === 0 ? ( <p className="text-muted-foreground text-center py-10">Carrinho vazio.</p> ) : ( cart.map(item => ( <div key={item.id} className="flex items-center justify-between"> <div> <p className="font-medium">{item.name}</p> <p className="text-sm text-muted-foreground">R$ {item.price}</p> </div> <div className="flex items-center gap-2"> <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleUpdateQuantity(item.id, -1)}><MinusCircle className="h-4 w-4" /></Button> <span>{item.quantity}</span> <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleUpdateQuantity(item.id, 1)}><PlusCircle className="h-4 w-4" /></Button> </div> </div> )) )}
                    </CardContent>
                    <CardFooter className="flex-col items-stretch space-y-4 border-t border-border/50 pt-6">
                        <div className="flex justify-between font-semibold"> <span>Subtotal</span> <span>R$ {total.toFixed(2)}</span> </div>
                        <div className="space-y-2"> <Label>Forma de Pagamento</Label> <Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}> <option className="bg-card text-foreground">Dinheiro</option> <option className="bg-card text-foreground">Cartão de Crédito</option> <option className="bg-card text-foreground">PIX</option> </Select> </div>
                        <Button onClick={handleFinalizeSale} disabled={cart.length === 0}>Finalizar Venda</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}