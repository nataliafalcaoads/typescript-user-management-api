
import { Router } from "express";

import { requireAuth } from "../../middlewares/auth.middleware.js";

import { requireSelf } from "../../middlewares/ownership.middleware.js";

import { passwordController } from "./password.controller.js";

import { userController } from "./user.controller.js";

const userRoutes = Router();

// ROTA PUBLICA

// Cadastrar usuario
userRoutes.post("/", userController.create);

// EXIGIR AUTENTICACAO NAS ROTAS ABAIXO
userRoutes.use(requireAuth);

// Alterar a senha da propria conta
userRoutes.patch(
  "/me/password",
  passwordController.changePassword
);

// Listar usuarios com paginacao
userRoutes.get("/", userController.list);

// Consultar somente a propria conta
userRoutes.get(
  "/:id",
  requireSelf,
  userController.findById
);

// Atualizar somente a propria conta
userRoutes.put(
  "/:id",
  requireSelf,
  userController.update
);

// Excluir somente a propria conta
userRoutes.delete(
  "/:id",
  requireSelf,
  userController.delete
);

export { userRoutes };
