
import "dotenv/config";

import { verify } from "jsonwebtoken";

import type { RequestHandler } from "express";

// Chave utilizada para verificar o JWT
const jwtSecret = process.env.JWT_SECRET;

if (
  !jwtSecret ||
  Buffer.byteLength(jwtSecret, "utf8") < 32
) {
  throw new Error(
    "JWT_SECRET deve conter pelo menos 32 bytes"
  );
}

// Middleware de autenticação
export const requireAuth: RequestHandler = (
  req,
  res,
  next
) => {
  const authorization = req.headers.authorization;

  // Verificar o cabeçalho Authorization
  const match = /^Bearer ([^\s]+)$/i.exec(
    authorization ?? ""
  );

  if (!match || !match[1]) {
    res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Token de autenticação não informado",
      },
    });
    return;
  }

  try {
    // Verificar assinatura e validade do token
    const payload = verify(match[1], jwtSecret, {
      algorithms: ["HS256"],
    });

    if (
      typeof payload === "string" ||
      typeof payload.sub !== "string" ||
      !payload.sub
    ) {
      throw new Error("Token sem usuário válido");
    }

    // Guardar o ID do usuário autenticado
    res.locals.authUserId = payload.sub;
  } catch {
    res.status(401).json({
      success: false,
      error: {
        code: "INVALID_TOKEN",
        message: "Token inválido ou expirado",
      },
    });
    return;
  }

  // Permitir continuar para a próxima função
  next();
};
