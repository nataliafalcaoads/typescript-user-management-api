
import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { loginSchema } from "./auth.schema.js";

import { authService } from "./auth.service.js";

export const authController = {
  // Realizar login
  async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    // Validar e-mail e senha
    const validation = loginSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Dados de login inválidos",
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
      // Verificar credenciais e gerar JWT
      const result = await authService.login(
        validation.data
      );

      // Retornar token ao usuário
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};