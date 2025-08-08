import z from "zod/v3";
import type { Client } from "../clients/schemas";
import type { Service } from "../services/schemas";

export const userSchema = z.object({
    name: z.string().min(3, { message: "O nome é obrigatório."}),
    email: z.string().email({ message: "E-mail inválido."}),
    role: z.enum(["Admin", "Funcionário", "Cliente"]),
});
export type UserSchema = z.infer<typeof userSchema>;
export type UserType = UserSchema & { id: number; };


export type Role = "Admin" | "Funcionário" | "Cliente";

export interface Appointment {
  id: number;
  date: Date;
  hour: string;
  clientId: number;
  clientName: string;
  serviceId: number;
  serviceName: string;
}

export interface ItemToDelete {
    type: 'client' | 'service' | 'user' | 'appointment';
    data: Client | Service | UserType | Appointment;
}

export interface SelectedSlot {
    date: Date;
    hour: string;
}
