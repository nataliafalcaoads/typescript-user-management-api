
import { Router } from "express";

import { requireAuth } from "../../middlewares/auth.middleware.js";
import { requireSelf } from "../../middlewares/ownership.middleware.js";

import { userController } from "./user.controller.js";
import { passwordController } from "./password.controller.js";

const userRoutes = Router();

// ========================================
// ROTAS PÚBLICAS
// ========================================

// Cadastrar usuário
userRoutes.post("/", userController.create);

// ========================================
// AUTENTICAÇÃO OBRIGATÓRIA
// ========================================

userRoutes.use(requireAuth);

// ========================================
// ALTERAÇÃO DE SENHA
// ========================================

// Alterar a própria senha usando /me
userRoutes.patch(
  "/me/password",
  passwordController.changePassword
);

// Alterar a própria senha usando o ID
// Bloqueia alterações na conta de terceiros
userRoutes.patch(
  "/:id/password",
  requireSelf,
  passwordController.changePassword
);

// ========================================
// CONSULTA DE USUÁRIOS
// ========================================

// Listar usuários com paginação
userRoutes.get("/", userController.list);

// Consultar somente a própria conta
userRoutes.get(
  "/:id",
  requireSelf,
  userController.findById
);

// ========================================
// ATUALIZAÇÃO DE USUÁRIOS
// ========================================

// Atualizar somente a própria conta
userRoutes.put(
  "/:id",
  requireSelf,
  userController.update
);

// ========================================
// EXCLUSÃO DE USUÁRIOS
// ========================================

// Excluir somente a própria conta
userRoutes.delete(
  "/:id",
  requireSelf,
  userController.delete
);

export { userRoutes };