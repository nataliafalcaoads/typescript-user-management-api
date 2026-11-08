
import { z } from "zod";

// Validação de cadastro
export const createUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "O nome deve ter pelo menos 2 caracteres")
    .max(120, "O nome deve ter no máximo 120 caracteres"),

  email: z
    .email("Informe um e-mail válido")
    .max(254, "O e-mail deve ter no máximo 254 caracteres")
    .toLowerCase(),

  password: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .refine(
      (password) => Buffer.byteLength(password, "utf8") <= 72,
      "A senha deve ter no máximo 72 bytes"
    ),
});

// Validação de paginação
export const listUsersQuerySchema = z.object({
  page: z.coerce
    .number()
    .int()
    .min(1)
    .max(1000000)
    .default(1),

  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(10),
});

// Validação de UUID
export const userIdParamsSchema = z.object({
  id: z.uuid(),
});

// Validação de atualização
export const updateUserSchema = z
  .strictObject({
    name: createUserSchema.shape.name.optional(),
    email: createUserSchema.shape.email.optional(),
  })
  .refine(
    (data) =>
      data.name !== undefined ||
      data.email !== undefined,
    {
      message: "Informe pelo menos um campo para atualizar",
    }
  );

// Tipos TypeScript
export type CreateUserInput = z.infer<
  typeof createUserSchema
>;

export type ListUsersQuery = z.infer<
  typeof listUsersQuerySchema
>;

export type UpdateUserInput = z.infer<
  typeof updateUserSchema
>;
