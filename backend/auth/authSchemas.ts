import * as z from "zod";

export const createUserSchema = z.object({
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

export const loginUserSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email("Email has to be a valid email")),
  password: z.string().max(64, "Password has a maximum of 64 characters"),
});
