
import type {
  Request,
  Response,
  NextFunction,
} from "express";

import {
  createUserSchema,
  listUsersQuerySchema,
  userIdParamsSchema,
  updateUserSchema,
} from "./user.schema.js";

import { userService } from "./user.service.js";

export const userController = {
  // Cadastrar usuário
  async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const validation = createUserSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Dados inválidos",
          details: validation.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
      });
      return;
    }

    try {
      const user = await userService.create(validation.data);

      res.status(201).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  // Listar usuários com paginação
  async list(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const validation = listUsersQuerySchema.safeParse(req.query);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Parâmetros de paginação inválidos",
          details: validation.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
      });
      return;
    }

    try {
      const { page, limit } = validation.data;

      const result = await userService.list(page, limit);

      res.status(200).json({
        success: true,
        data: result.users,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  },

  // Buscar usuário pelo ID
  async findById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const validation = userIdParamsSchema.safeParse(req.params);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Identificador de usuário inválido",
          details: validation.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
      });
      return;
    }

    try {
      const user = await userService.findById(validation.data.id);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  // Atualizar nome e/ou e-mail
  async update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const paramsValidation = userIdParamsSchema.safeParse(
      req.params
    );

    if (!paramsValidation.success) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Identificador de usuário inválido",
          details: paramsValidation.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
      });
      return;
    }

    const bodyValidation = updateUserSchema.safeParse(req.body);

    if (!bodyValidation.success) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Dados inválidos para atualização",
          details: bodyValidation.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
      });
      return;
    }

    try {
      const user = await userService.update(
        paramsValidation.data.id,
        bodyValidation.data
      );

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  // Excluir usuário pelo ID
  async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const validation = userIdParamsSchema.safeParse(req.params);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Identificador de usuário inválido",
          details: validation.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
      });
      return;
    }

    try {
      await userService.delete(validation.data.id);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
