
import type { ErrorRequestHandler } from "express";

import {
  EmailAlreadyInUseError,
  UserNotFoundError,
} from "../modules/users/user.service.js";

import { InvalidCredentialsError } from "../modules/auth/auth.service.js";

import { InvalidCurrentPasswordError } from "../modules/users/password.service.js";

export const errorMiddleware: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next
) => {
  // Senha atual incorreta na alteração de senha
  if (error instanceof InvalidCurrentPasswordError) {
    res.status(401).json({
      success: false,
      error: {
        code: "INVALID_CURRENT_PASSWORD",
        message: "Senha atual incorreta",
      },
    });
    return;
  }

  // Credenciais incorretas no login
  if (error instanceof InvalidCredentialsError) {
    res.status(401).json({
      success: false,
      error: {
        code: "INVALID_CREDENTIALS",
        message: "E-mail ou senha inválidos",
      },
    });
    return;
  }

  // Usuário não encontrado
  if (error instanceof UserNotFoundError) {
    res.status(404).json({
      success: false,
      error: {
        code: "USER_NOT_FOUND",
        message: "Usuário não encontrado",
      },
    });
    return;
  }

  // E-mail já cadastrado
  if (error instanceof EmailAlreadyInUseError) {
    res.status(409).json({
      success: false,
      error: {
        code: "EMAIL_ALREADY_IN_USE",
        message: "Este e-mail já está cadastrado",
      },
    });
    return;
  }

  // Erros conhecidos do Prisma
  if (
    error !== null &&
    typeof error === "object" &&
    "code" in error
  ) {
    // Violação de campo único
    if (error.code === "P2002") {
      res.status(409).json({
        success: false,
        error: {
          code: "EMAIL_ALREADY_IN_USE",
          message: "Este e-mail já está cadastrado",
        },
      });
      return;
    }

    // Registro não encontrado
    if (error.code === "P2025") {
      res.status(404).json({
        success: false,
        error: {
          code: "USER_NOT_FOUND",
          message: "Usuário não encontrado",
        },
      });
      return;
    }
  }

  // Erros inesperados
  console.error("Erro interno da API:", error);

  res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Erro interno do servidor",
    },
  });
};
