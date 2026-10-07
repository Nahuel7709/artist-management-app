import type { ReactNode } from "react";

import { AuthContext } from "./AuthContext";
import { useAuth } from "@/hooks/useAuth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const value = useAuth();
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
