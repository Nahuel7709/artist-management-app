import type { Role } from "../generated/prisma/client.ts";

declare global {
  namespace Express {
    interface Locals {
      user?: { id: string; name: string; email: string; role: Role };
    }
  }
}
