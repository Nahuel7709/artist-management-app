import type { Request, Response } from "express";
import * as z from "zod";
import { prisma } from "../db/prisma.ts";
import argon2 from "argon2";
import { Prisma } from "../generated/prisma/client.ts";

const createUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name has a minimum of 3 characters")
    .max(50, "Name has a maximum of 50 characters"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email("Email has to be a valid email")),
  password: z
    .string()
    .min(8, "Password has a minimum of 8 characters")
    .max(64, "Password has a maximum of 64 characters"),
});

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
