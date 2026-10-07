import { useState, useEffect, useCallback } from "react";
import type { User } from "@/interfaces/User";
import { MESSAGES } from "@/constants/messages";
import {
  fetchMe,
  loginRequest,
  logoutRequest,
  registerRequest,
} from "@/api/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  async function login(email: string, password: string) {
    const loggedUser = await loginRequest(email, password);
    setUser(loggedUser);
  }

  async function register(name: string, email: string, password: string) {
    await registerRequest(name, email, password);
    await login(email, password);
  }

  async function logout() {
    await logoutRequest();
    setUser(null);
  }


  const checkSession = useCallback(async () => {
    setAuthError(null);
    setLoading(true);

    try {
      const data = await fetchMe();
      setUser(data);
    } catch {
      setUser(null);
      setAuthError(MESSAGES.session.checkFailed);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe()
      .then((data) => setUser(data))
      .catch(() => setAuthError(MESSAGES.session.checkFailed))
      .finally(() => setLoading(false));
  }, []);

  return { user, loading, login, register, logout, authError, checkSession };
}
