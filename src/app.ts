
import express from "express";

import { userRoutes } from "./modules/users/user.routes.js";

import { authRoutes } from "./modules/auth/auth.routes.js";

import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

// Permitir requisições JSON
app.use(express.json());

// Verificar funcionamento da API
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "API funcionando corretamente!",
    timestamp: new Date().toISOString(),
  });
});

// Rotas de usuários
app.use("/users", userRoutes);

// Rotas de autenticação
app.use("/auth", authRoutes);

// Tratamento centralizado de erros
app.use(errorMiddleware);

export { app };