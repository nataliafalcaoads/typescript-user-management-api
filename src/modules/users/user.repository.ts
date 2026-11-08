
import { prisma } from "../../lib/prisma.js";

import type { UpdateUserInput } from "./user.schema.js";

interface CreateUserData {
  name: string;
  email: string;
  passwordHash: string;
}

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const userRepository = {
  // Buscar usuário pelo e-mail
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  },

  // Criar usuário
  async create(data: CreateUserData) {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
      },
      select: publicUserSelect,
    });
  },

  // Listar usuários com paginação
  async findMany(page: number, limit: number) {
    const skip = (page - 1) * limit;

    return prisma.user.findMany({
      skip,
      take: limit,
      orderBy: [
        { createdAt: "desc" },
        { id: "asc" },
      ],
      select: publicUserSelect,
    });
  },

  // Contar usuários
  async count() {
    return prisma.user.count();
  },

  // Buscar usuário pelo ID
  async findById(id: string) {
    return prisma.user.findUnique({
      where: {
        id,
      },
      select: publicUserSelect,
    });
  },

  // Atualizar nome e/ou e-mail
  async update(id: string, data: UpdateUserInput) {
    return prisma.user.update({
      where: {
        id,
      },
      data: {
        ...(data.name !== undefined && {
          name: data.name,
        }),
        ...(data.email !== undefined && {
          email: data.email,
        }),
      },
      select: publicUserSelect,
    });
  },

  // Excluir usuário pelo ID
  async delete(id: string) {
    return prisma.user.delete({
      where: {
        id,
      },
      select: publicUserSelect,
    });
  },
};
