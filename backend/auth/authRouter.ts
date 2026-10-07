import { Router } from "express";
import { register } from "./authController.ts";

export const authRouter = Router();

//Register
authRouter.post("/register", register);
