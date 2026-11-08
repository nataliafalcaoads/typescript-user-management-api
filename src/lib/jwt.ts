
import "dotenv/config";

import { sign } from "jsonwebtoken";

// Carregar e validar a chave secreta
function loadJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (
    !secret ||
    Buffer.byteLength(secret, "utf8") < 32
  ) {
    throw new Error(
      "JWT_SECRET deve conter pelo menos 32 bytes"
    );
  }

  return secret;
}

const jwtSecret = loadJwtSecret();

// Gerar token de acesso
export function generateAccessToken(
  userId: string
): string {
  return sign({}, jwtSecret, {
    subject: userId,
    expiresIn: "1h",
    algorithm: "HS256",
  });
}
