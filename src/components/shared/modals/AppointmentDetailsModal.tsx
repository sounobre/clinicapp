import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Appointment } from "@/features/admin/schemas.ts";
import type { Client } from "@/features/clients/schemas.ts";
import type { Service } from "@/features/services/schemas.ts";

import { CreditCard, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface AppointmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Appointment) => void;
  onDelete: (appointment: Appointment) => void;
  onGoToPdv: (service: Service) => void;
  appointment: Appointment | null;
  clients: Client[];
  services: Service[];
}

export function AppointmentDetailsModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  onGoToPdv,
  appointment,
  services,
  clients,
}: AppointmentDetailsModalProps) {
  const [clientId, setClientId] = useState<string>(
    appointment ? String(appointment.clientId) : ""
  );
  const [serviceId, setServiceId] = useState<string>(
    appointment ? String(appointment.serviceId) : ""
  );

  useEffect(() => {
    if (appointment) {
      setClientId(String(appointment.clientId));
      setServiceId(String(appointment.serviceId));
    }
  }, [appointment]);

  if (!isOpen || !appointment) return null;

  const handleSave = () => {
    if (!clientId || !serviceId) return;
    const client = clients.find((c) => c.id === parseInt(clientId));
    const service = services.find((s) => s.id === parseInt(serviceId));
    if (client && service) {
      onSave({
        ...appointment,
        clientId: client.id,
        clientName: client.name,
        serviceId: service.id,
        serviceName: service.name,
      });
    }
  };

  const handleGoToPdv = () => {
    const service = services.find((s) => s.id === parseInt(serviceId));
    if (service) onGoToPdv(service);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Detalhes do Agendamento</CardTitle>
          <CardDescription>
            {" "}
            Editando agendamento de{" "}
            <span className="text-primary font-semibold">
              {new Date(appointment.date).toLocaleDateString("pt-BR")}
            </span>{" "}
            às{" "}
            <span className="text-primary font-semibold">
              {appointment.hour}
            </span>
            .{" "}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="details-client">Cliente</Label>
            {/* <Select
              id="details-client"
              value={clientId}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setClientId(e.target.value)
              }
              required
            > *
              {clients.map((client) => (
                <option
                  key={client.id}
                  value={client.id}
                  className="bg-card text-foreground"
                >
                  {client.name}
                </option>
              ))} */}
            <Select value={clientId} onValueChange={setClientId} required>
              <SelectTrigger className="w-full" aria-label="Cliente">
                <SelectValue placeholder="Selecione o cliente" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={String(client.id)}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="details-service">Serviço</Label>
           {/*} <Select
              id="details-service"
              value={serviceId}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setServiceId(e.target.value)
              }
              required
            >
              {services.map((service) => (
                <option
                  key={service.id}
                  value={service.id}
                  className="bg-card text-foreground"
                >
                  {service.name}
                </option>
              ))} */}
              <Select value={serviceId} onValueChange={setServiceId} required>
              <SelectTrigger className="w-full" aria-label="Serviço">
                <SelectValue placeholder="Selecione o Serviço" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={String(service.id)}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex-col sm:flex-row items-center gap-2">
          <Button
            onClick={handleGoToPdv}
            className="w-full sm:w-auto"
            variant="outline"
          >
            <CreditCard className="mr-2 h-4 w-4" /> Ir para o PDV
          </Button>
          <div className="flex-1" />
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar Alterações</Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onDelete(appointment)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
