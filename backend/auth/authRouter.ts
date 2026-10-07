import { Router } from "express";
import { login, logout, me, register } from "./authController.ts";
import { authMiddleware } from "../middlewares/authMiddleware.ts";

export const authRouter = Router();

//Register
authRouter.post("/register", register);

//Login
authRouter.post("/login", login);

//me
authRouter.get("/me", authMiddleware, me);

//logout
authRouter.post("/logout", logout);
