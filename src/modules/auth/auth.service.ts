
import { compare } from "bcryptjs";

import { generateAccessToken } from "../../lib/jwt.js";

import { userRepository } from "../users/user.repository.js";

import type { LoginInput } from "./auth.schema.js";

// Erro de autenticação
export class InvalidCredentialsError extends Error {
  constructor() {
    super("E-mail ou senha inválidos");
    this.name = "InvalidCredentialsError";
  }
}

export const authService = {
  // Autenticar usuário
  async login(data: LoginInput) {
    // Buscar usuário pelo e-mail
    const user = await userRepository.findByEmail(
      data.email
    );

    if (!user) {
      throw new InvalidCredentialsError();
    }

    // Comparar senha com o hash armazenado
    const passwordMatches = await compare(
      data.password,
      user.passwordHash
    );

    if (!passwordMatches) {
      throw new InvalidCredentialsError();
    }

    // Gerar token JWT
    const accessToken = generateAccessToken(user.id);

    return {
      accessToken,
      tokenType: "Bearer",
      expiresIn: 3600,
    };
  },
};
