import type { Request, Response } from "express";
import { prisma } from "../db/prisma.ts";
import argon2 from "argon2";
import { Prisma } from "../generated/prisma/client.ts";
import { cookieOptions, JWT_SECRET } from "./config.ts";
import jwt from "jsonwebtoken";
import { createUserSchema, loginUserSchema } from "./authSchemas.ts";

export async function register(req: Request, res: Response) {
  const result = createUserSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ message: result.error.issues[0].message });
    return;
  }

  const { name, email, password } = result.data;
  const passwordHash = await argon2.hash(password);

  try {
    const user = await prisma.user.create({
      data: { name, email, passwordHash },
      select: { id: true, name: true, email: true, role: true },
    });
    res.status(201).json(user);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      res.status(409).json({ message: "Email already in use" });
      return;
    }
    throw error;
  }
}

export async function login(req: Request, res: Response) {
  const result = loginUserSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ message: result.error.issues[0].message });
    return;
  }

  const { email, password } = result.data;

  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const checkLogin = await argon2.verify(user.passwordHash, password);
  if (!checkLogin) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const token = jwt.sign({ sub: user.id }, JWT_SECRET, {
    expiresIn: "12h",
  });

  res
    .status(200)
    .cookie("token", token, cookieOptions)
    .json({ id: user.id, name: user.name, email: user.email, role: user.role });
}

export async function me(_req: Request, res: Response) {
  res.json(res.locals.user);
}

export function logout(_req: Request, res: Response) {
  res.clearCookie("token", cookieOptions);
  res.status(204).end();
}
