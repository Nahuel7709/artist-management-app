import { Navigate, Outlet } from "react-router";
import { useAuthContext } from "@/context/auth";
import { Button } from "@/components/ui/button";

export function RequireAuth() {
  const { user, loading, authError, checkSession } = useAuthContext();

  if (loading) {
    return <p className="p-6">Cargando...</p>;
  }

  if (authError) {
    return (
      <div className="flex flex-col items-start gap-3 p-6">
        <p className="text-destructive">{authError}</p>
        <Button onClick={checkSession}>Reintentar</Button>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
