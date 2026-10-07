export type Role = "FINANCE" | "MANAGER";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}
