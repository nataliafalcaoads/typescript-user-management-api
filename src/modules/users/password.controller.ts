
import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { changePasswordSchema } from "./password.schema.js";

import { passwordService } from "./password.service.js";

// Controller responsável pela alteração de senha
export const passwordController = {
  async changePassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    // Identificar o usuário autenticado pelo JWT
    const userId = res.locals.authUserId;

    if (typeof userId !== "string" || !userId) {
      res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Usuário não autenticado",
        },
      });
      return;
    }

    // Validar senha atual e nova senha
    const validation = changePasswordSchema.safeParse(
      req.body
    );

    if (!validation.success) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Dados inválidos para alteração de senha",
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

    try {
      // Alterar a senha do usuário autenticado
      const result = await passwordService.changePassword(
        userId,
        validation.data
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};
