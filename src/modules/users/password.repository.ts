
import { prisma } from "../../lib/prisma.js";

// Repositório responsável pelas operações de senha
export const passwordRepository = {
  // Buscar o hash da senha do usuário
  async findCredentialsById(id: string) {
    return prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        passwordHash: true,
      },
    });
  },

  // Atualizar o hash da senha no banco
  async updatePasswordHash(
    id: string,
    passwordHash: string
  ) {
    return prisma.user.update({
      where: {
        id,
      },
      data: {
        passwordHash,
      },
      select: {
        id: true,
      },
    });
  },
};
