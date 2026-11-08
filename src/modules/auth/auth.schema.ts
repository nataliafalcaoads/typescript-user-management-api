
import { z } from "zod";

// Validação dos dados de login
export const loginSchema = z.object({
  email: z
    .email("Informe um e-mail válido")
    .toLowerCase(),

  password: z
    .string()
    .min(1, "Informe a senha"),
});

// Tipo TypeScript do login
export type LoginInput = z.infer<typeof loginSchema>;
