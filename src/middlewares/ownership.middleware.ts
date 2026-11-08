
import type { RequestHandler } from "express";

import { userIdParamsSchema } from "../modules/users/user.schema.js";

// Verificar se o usuário está acessando sua própria conta
export const requireSelf: RequestHandler = (
  req,
  res,
  next
) => {
  // Validar o UUID informado na rota
  const validation = userIdParamsSchema.safeParse(
    req.params
  );

  if (!validation.success) {
    res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Identificador de usuário inválido",
        details: validation.error.issues.map(
          (issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })
        ),
      },
    });
    return;
  }

  // ID obtido do token JWT validado
  const authenticatedUserId = res.locals.authUserId;

  // ID informado na URL
  const requestedUserId = validation.data.id;

  // Impedir alterações em contas de terceiros
  if (
    typeof authenticatedUserId !== "string" ||
    authenticatedUserId !== requestedUserId
  ) {
    res.status(403).json({
      success: false,
      error: {
        code: "FORBIDDEN",
        message:
          "Você não tem permissão para modificar este usuário",
      },
    });
    return;
  }

  // Acesso autorizado
  next();
};
