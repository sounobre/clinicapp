import z from "zod";

export const employeeSchema = z.object({
  photo: z.any().optional(),
  fullName: z.string().min(3, "Nome completo é obrigatório."),
  cpf: z.string().min(14, "CPF inválido.").refine(cpf => {
    // Basic CPF validation
    const cleaned = cpf.replace(/[^\d]/g, "");
    if (cleaned.length !== 11 || /^(\d)\1+$/.test(cleaned)) return false;
    let sum = 0;
    let remainder;
    for (let i = 1; i <= 9; i++) sum += parseInt(cleaned.substring(i - 1, i)) * (11 - i);
    remainder = (sum * 10) % 11;
    if ((remainder === 10) || (remainder === 11)) remainder = 0;
    if (remainder !== parseInt(cleaned.substring(9, 10))) return false;
    sum = 0;
    for (let i = 1; i <= 10; i++) sum += parseInt(cleaned.substring(i - 1, i)) * (12 - i);
    remainder = (sum * 10) % 11;
    if ((remainder === 10) || (remainder === 11)) remainder = 0;
    if (remainder !== parseInt(cleaned.substring(10, 11))) return false;
    return true;
  }, "CPF inválido."),
  rg: z.string().optional(),
  birthDate: z.string().min(1, "Data de nascimento é obrigatória."),
  gender: z.string().min(1, "Gênero é obrigatório."),
  personalEmail: z.string().email("E-mail inválido.").min(1, "E-mail é obrigatório."),
  phone: z.string().min(15, "Telefone inválido."),
  cep: z.string().min(9, "CEP inválido."),
  street: z.string().min(1, "Rua é obrigatória."),
  number: z.string().min(1, "Número é obrigatório."),
  neighborhood: z.string().min(1, "Bairro é obrigatório."),
  city: z.string().min(1, "Cidade é obrigatória."),
  state: z.string().min(1, "Estado é obrigatório."),
  complement: z.string().optional(),
  admissionDate: z.string().min(1, "Data de admissão é obrigatória."),
  role: z.string().min(1, "Cargo é obrigatório."),
  professionalCouncil: z.string().optional(),
  councilNumber: z.string().optional(),
  councilState: z.string().optional(),
  specialties: z.array(z.string()).optional(),
  accessEmail: z.string().email("E-mail de acesso inválido.").min(1, "E-mail de acesso é obrigatório."),
  accessProfile: z.string().min(1, "Perfil de acesso é obrigatório."),
  status: z.boolean().default(true),
}).superRefine((data, ctx) => {
    const professionalRoles = ['Médico(a)', 'Dentista', 'Enfermeiro(a)'];
    if (professionalRoles.includes(data.role)) {
        if (!data.professionalCouncil) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Conselho é obrigatório.", path: ["professionalCouncil"] });
        }
        if (!data.councilNumber) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Nº do registro é obrigatório.", path: ["councilNumber"] });
        }
        if (!data.councilState) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "UF do conselho é obrigatória.", path: ["councilState"] });
        }
    }
});