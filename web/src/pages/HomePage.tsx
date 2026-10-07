import { useState } from "react";
import { useAuthContext } from "@/context/auth";
import { MESSAGES } from "@/constants/messages";
import type { Role } from "@/interfaces/User";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ROLE_LABELS: Record<Role, string> = {
  FINANCE: "Finanzas",
  MANAGER: "Manager",
};

export function HomePage() {
  const { user, logout } = useAuthContext();
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  if (!user) return null;

  async function handleLogout() {
    setLogoutError(null);
    setLoggingOut(true);
    try {
      await logout();
    } catch (err) {
      setLogoutError(
        err instanceof Error ? err.message : MESSAGES.logout.generic,
      );
      setLoggingOut(false);
    }
  }

  return (
    <main className="min-h-svh bg-muted/40 p-6">
      <div className="mx-auto flex max-w-2xl flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Inicio</h1>
          <Button
            variant="outline"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
          </Button>
        </div>

        {logoutError && (
          <Alert variant="destructive">
            <AlertDescription>{logoutError}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Tu cuenta</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-[100px_1fr] gap-y-3 text-sm">
              <dt className="text-muted-foreground">Nombre</dt>
              <dd>{user.name}</dd>
              <dt className="text-muted-foreground">Email</dt>
              <dd>{user.email}</dd>
              <dt className="text-muted-foreground">Rol</dt>
              <dd>
                <Badge variant="secondary">{ROLE_LABELS[user.role]}</Badge>
              </dd>
            </dl>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
