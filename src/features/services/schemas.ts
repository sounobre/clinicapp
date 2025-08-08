import z from "zod/v3";

export const serviceSchema = z.object({
    name: z.string().min(3, { message: "O nome do serviço é obrigatório."}),
    price: z.string().refine(val => !isNaN(parseFloat(val)), { message: "O preço deve ser um número."}),
    duration: z.string().optional(),
});
export type ServiceSchema = z.infer<typeof serviceSchema>;
export type Service = ServiceSchema & { id: number; };