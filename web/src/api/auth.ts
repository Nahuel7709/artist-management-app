import type { User } from "@/interfaces/User";
import { MESSAGES } from "@/constants/messages";

const API_URL = import.meta.env.VITE_API_URL;

export async function fetchMe(): Promise<User | null> {
  const res = await fetch(`${API_URL}/auth/me`, { credentials: "include" });

  if (res.status === 401) {
    return null;
  }

  if (!res.ok) {
    throw new Error(`Error ${res.status}`);
  }

  return res.json();
}

export async function loginRequest(
  email: string,
  password: string,
): Promise<User> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/auth/login`, {
      credentials: "include",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    throw new Error(MESSAGES.network);
  }

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error(MESSAGES.login.invalidCredentials);
    }
    throw new Error(MESSAGES.login.generic);
  }

  return res.json();
}

export async function registerRequest(
  name: string,
  email: string,
  password: string,
): Promise<void> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
  } catch {
    throw new Error(MESSAGES.network);
  }

  if (!res.ok) {
    if (res.status === 409) {
      throw new Error(MESSAGES.register.emailTaken);
    }
    if (res.status === 400) {
      throw new Error(MESSAGES.register.invalidData);
    }
    throw new Error(MESSAGES.register.generic);
  }
}

export async function logoutRequest(): Promise<void> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/auth/logout`, {
      credentials: "include",
      method: "POST",
    });
  } catch {
    throw new Error(MESSAGES.network);
  }

  if (!res.ok) {
    throw new Error(MESSAGES.logout.generic);
  }
}
