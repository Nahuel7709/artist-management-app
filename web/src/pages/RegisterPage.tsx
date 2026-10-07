import { useState, type SubmitEvent } from "react";
import { Link } from "react-router";
import { useAuthContext } from "@/context/auth";
import { MESSAGES } from "@/constants/messages";
import { isValidEmail } from "@/lib/validation";
import { FormField } from "@/components/FormField";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type RegisterErrors = { name?: string; email?: string; password?: string };

export function RegisterPage() {
  const { register } = useAuthContext();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const newErrors: RegisterErrors = {};
    const trimmedName = name.trim();
    if (trimmedName.length < 3 || trimmedName.length > 50) {
      newErrors.name = MESSAGES.validation.nameLength;
    }
    if (!isValidEmail(email)) {
      newErrors.email = MESSAGES.validation.emailInvalid;
    }
    if (password.length < 8 || password.length > 64) {
      newErrors.password = MESSAGES.validation.passwordLength;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      await register(name.trim(), email.trim(), password);
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : MESSAGES.register.generic,
      );
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <div className="mb-2 flex items-center gap-2">
            <span className="size-6 rounded-md bg-primary" aria-hidden="true" />
            <span className="font-semibold">Artist Management</span>
          </div>
          <CardTitle>Crear cuenta</CardTitle>
          <CardDescription>
            Completá tus datos para registrarte.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-4"
          >
            {formError && (
              <Alert variant="destructive">
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}
            <FormField
              id="name"
              label="Nombre"
              value={name}
              onChange={setName}
              error={errors.name}
              autoComplete="name"
            />
            <FormField
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              error={errors.email}
              autoComplete="email"
              placeholder="nombre@agencia.com"
            />
            <FormField
              id="password"
              label="Contraseña"
              type="password"
              value={password}
              onChange={setPassword}
              error={errors.password}
              autoComplete="new-password"
            />
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "Creando cuenta..." : "Crear cuenta"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center text-sm text-muted-foreground">
          ¿Ya tenés cuenta?&nbsp;
          <Link
            to="/login"
            className="font-medium text-primary hover:underline"
          >
            Iniciá sesión
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
