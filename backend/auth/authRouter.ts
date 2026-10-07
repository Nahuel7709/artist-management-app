import { Router } from "express";
import { login, register } from "./authController.ts";

export const authRouter = Router();

//Register
authRouter.post("/register", register);

//Login
authRouter.post("/login", login);
