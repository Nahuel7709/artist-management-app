import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../auth/config.ts";
import { prisma } from "../db/prisma.ts";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies.token;
  if (typeof token !== "string") {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  let userId: string;

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (typeof payload === "string" || !payload.sub) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }
    userId = payload.sub;
  } catch {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true },
  });

  if (user === null) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  res.locals.user = user;
  next();
}
