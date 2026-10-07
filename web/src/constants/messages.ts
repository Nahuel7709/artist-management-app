export const MESSAGES = {
  network: "No pudimos conectar con el servidor. Intentá de nuevo.",
  login: {
    invalidCredentials: "Email o contraseña incorrectos.",
    generic: "No pudimos iniciar sesión. Intentá de nuevo.",
  },
  register: {
    emailTaken: "Ese email ya está registrado.",
    invalidData: "Revisá los datos ingresados.",
    generic: "No pudimos crear la cuenta. Intentá de nuevo.",
  },
  logout: {
    generic: "No pudimos cerrar la sesión. Intentá de nuevo.",
  },
  session: {
    checkFailed:
      "No pudimos verificar tu cuenta. Puede que el servidor no esté disponible.",
  },
  validation: {
    nameLength: "El nombre tiene que tener entre 3 y 50 caracteres.",
    emailInvalid: "Ingresá un email válido.",
    passwordRequired: "Ingresá tu contraseña.",
    passwordLength: "La contraseña tiene que tener entre 8 y 64 caracteres.",
  },
} as const;
