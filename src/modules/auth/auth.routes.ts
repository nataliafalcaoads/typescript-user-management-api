
import { Router } from "express";

import { authController } from "./auth.controller.js";

const authRoutes = Router();

// Realizar login com e-mail e senha
authRoutes.post("/login", authController.login);

export { authRoutes };
