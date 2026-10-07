import "dotenv/config";

import type { CookieOptions } from "express";

const jwt_secret = process.env.JWT_SECRET;
const isProduction = process.env.NODE_ENV === "production";

if (!jwt_secret) {
  throw new Error("jwt secret missing");
}

export const JWT_SECRET: string = jwt_secret;
export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax",
  maxAge: 12 * 60 * 60 * 1000,
};
