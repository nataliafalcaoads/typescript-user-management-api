
import { compare, hash } from "bcryptjs";

import { passwordRepository } from "./password.repository.js";

import type { ChangePasswordInput } from "./password.schema.js";

import { UserNotFoundError } from "./user.service.js";

// Erro quando a senha atual estiver incorreta
export class InvalidCurrentPasswordError extends Error {
  constructor() {
    super("Senha atual incorreta");
    this.name = "InvalidCurrentPasswordError";
  }
}

// Serviço de alteração de senha
export const passwordService = {
  async changePassword(
    userId: string,
    data: ChangePasswordInput
  ) {
    // Buscar as credenciais do usuário
    const user =
      await passwordRepository.findCredentialsById(
        userId
      );

    if (!user) {
      throw new UserNotFoundError();
    }

    // Conferir a senha atual
    const passwordMatches = await compare(
      data.currentPassword,
      user.passwordHash
    );

    if (!passwordMatches) {
      throw new InvalidCurrentPasswordError();
    }

    // Gerar hash da nova senha
    const newPasswordHash = await hash(
      data.newPassword,
      12
    );

    // Salvar nova senha no PostgreSQL
    await passwordRepository.updatePasswordHash(
      userId,
      newPasswordHash
    );

    return {
      message: "Senha alterada com sucesso",
    };
  },
};
