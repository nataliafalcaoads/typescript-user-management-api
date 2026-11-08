
import { z } from "zod";

// Validar os dados para alteração de senha
export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Informe a senha atual"),

    newPassword: z
      .string()
      .min(
        8,
        "A nova senha deve ter pelo menos 8 caracteres"
      )
      .refine(
        (password) =>
          Buffer.byteLength(password, "utf8") <= 72,
        "A nova senha deve ter no máximo 72 bytes"
      ),
  })
  .refine(
    (data) =>
      data.currentPassword !== data.newPassword,
    {
      message:
        "A nova senha deve ser diferente da senha atual",
      path: ["newPassword"],
    }
  );

// Tipo TypeScript
export type ChangePasswordInput = z.infer<
  typeof changePasswordSchema
>;
