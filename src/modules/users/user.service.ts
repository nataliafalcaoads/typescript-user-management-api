
import { hash } from "bcryptjs";

import { userRepository } from "./user.repository.js";

import type {
  CreateUserInput,
  UpdateUserInput,
} from "./user.schema.js";

// Erro para e-mail já cadastrado
export class EmailAlreadyInUseError extends Error {
  constructor() {
    super("Este e-mail já está cadastrado");
    this.name = "EmailAlreadyInUseError";
  }
}

// Erro para usuário inexistente
export class UserNotFoundError extends Error {
  constructor() {
    super("Usuário não encontrado");
    this.name = "UserNotFoundError";
  }
}

export const userService = {
  // Cadastrar usuário
  async create(data: CreateUserInput) {
    const existingUser = await userRepository.findByEmail(
      data.email
    );

    if (existingUser) {
      throw new EmailAlreadyInUseError();
    }

    const passwordHash = await hash(data.password, 12);

    return userRepository.create({
      name: data.name,
      email: data.email,
      passwordHash,
    });
  },

  // Listar usuários com paginação
  async list(page: number, limit: number) {
    const [users, total] = await Promise.all([
      userRepository.findMany(page, limit),
      userRepository.count(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  },

  // Buscar usuário pelo ID
  async findById(id: string) {
    const user = await userRepository.findById(id);

    if (!user) {
      throw new UserNotFoundError();
    }

    return user;
  },

  // Atualizar nome e/ou e-mail
  async update(id: string, data: UpdateUserInput) {
    const existingUser = await userRepository.findById(id);

    if (!existingUser) {
      throw new UserNotFoundError();
    }

    if (
      data.email !== undefined &&
      data.email !== existingUser.email
    ) {
      const emailOwner = await userRepository.findByEmail(
        data.email
      );

      if (emailOwner && emailOwner.id !== id) {
        throw new EmailAlreadyInUseError();
      }
    }

    return userRepository.update(id, data);
  },

  // Excluir usuário pelo ID
  async delete(id: string) {
    const existingUser = await userRepository.findById(id);

    if (!existingUser) {
      throw new UserNotFoundError();
    }

    await userRepository.delete(id);
  },
};
