import { Link } from "react-router";
import { buttonVariants } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 bg-muted/40 p-4 text-center">
      <p className="text-sm font-medium text-primary">404</p>
      <h1 className="text-2xl font-semibold">No encontramos esta página</h1>
      <p className="text-sm text-muted-foreground">
        Puede que el link esté mal o que la página ya no exista.
      </p>
      <Link to="/" className={buttonVariants()}>
        Volver al inicio
      </Link>
    </main>
  );
}
