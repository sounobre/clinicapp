import  { Button } from "@/components/ui/button";
import  { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import type { SelectedSlot } from "@/features/admin/schemas";
import type { Client } from "@/features/clients/schemas";
import  type { Service } from "@/features/services/schemas";

import  { useState } from "react";

interface NewAppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (clientId: string, serviceId: string) => void;
    selectedSlot: SelectedSlot | null;
    clients: Client[];
    services: Service[];
}

export function NewAppointmentModal({
                                        isOpen,
                                        onClose,
                                        onSave,
                                        selectedSlot,
                                        clients,
                                        services
                                    }: NewAppointmentModalProps) {
    if (!isOpen || !selectedSlot) return null;
    const [clientId, setClientId] = useState('');
    const [serviceId, setServiceId] = useState('');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!clientId || !serviceId) return;
        onSave(clientId, serviceId);
    };
    return (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"><Card
        className="w-full max-w-lg">
        <form onSubmit={handleSubmit}><CardHeader> <CardTitle>Novo Agendamento</CardTitle> <CardDescription> Agendando
            para <span
                className="text-primary font-semibold">{selectedSlot.date.toLocaleDateString('pt-BR')}</span> às <span
                className="text-primary font-semibold">{selectedSlot.hour}</span>. </CardDescription> </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2"><Label htmlFor="client">Cliente</Label> <Select id="client" value={clientId}
                                                                                           onChange={(e) => setClientId(e.target.value)}
                                                                                           required>
                    <option value="" disabled>Selecione um cliente</option>
                    {clients.map(client => <option key={client.id} value={client.id}
                                                   className="bg-card text-foreground">{client.name}</option>)}</Select>
                </div>
                <div className="space-y-2"><Label htmlFor="service">Serviço</Label> <Select id="service"
                                                                                            value={serviceId}
                                                                                            onChange={(e) => setServiceId(e.target.value)}
                                                                                            required>
                    <option value="" disabled>Selecione um serviço</option>
                    {services.map(service => <option key={service.id} value={service.id}
                                                     className="bg-card text-foreground">{service.name}</option>)}
                </Select></div>
            </CardContent> <CardFooter className="justify-end gap-2"> <Button variant="outline" type="button"
                                                                              onClick={onClose}>Cancelar</Button>
                <Button type="submit" disabled={!clientId || !serviceId}>Agendar</Button> </CardFooter></form>
    </Card></div>);
}
