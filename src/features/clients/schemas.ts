import z from "zod/v3";

export const clientSchema = z.object({
  name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }).optional().or(z.literal('')),
  phone: z.string().optional(),
});
export type ClientSchema = z.infer<typeof clientSchema>;
export type Client = ClientSchema & { id: number; };