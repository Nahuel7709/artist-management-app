# Task 1

## Before coding

- Which parts of Task 7 can you reuse, and what changes for this app?
  A lot of things. We're going to create a database in Supabase the same way, and use the same approach for the Prisma setup. Then the endpoints and their logic will be practically the same, except that here we'll have other roles and logic about what each role can do. We can reuse things like the seed logic, the validations, the normalized email logic, the difference between "there's no session" and "the session couldn't be checked", etc.

- How do MANAGER and FINANCE differ? Which differences are about permissions and which are about ownership of a record?
  A manager requests approval to be able to make certain expenses, and FINANCE can approve or reject them. FINANCE can see the overall status, etc. Approving or rejecting expenses, recording collections and payments, and generating and approving settlements are about permissions: if you're FINANCE you can do it, and if not, you can't. Following their own entries, and seeing or not seeing other managers' artists, are about ownership: if it belongs to you, you can see it, and if not, you can't.

- How will you prevent signup from creating a privileged account?
  Because when you sign up, the app directly assigns you the MANAGER role. Also, the role is never read from the body, the Zod validation removes the fields that aren't in the schema, the database has MANAGER as the default, and the only way to create a FINANCE account is the seed.

- In a real agency of around ten people, would public signup even make sense, or would accounts be created by someone? Say what you would do and why we are doing it this way for now.
  This question is interesting, because if this app is going to be used by one company for now, we don't want just anyone to be able to sign up, since they would instantly become part of the company's app, even if only as a manager. From what I saw, I think we should only allow signing up through an invitation. I understand we're doing it this way now to practice the signup flow. But if signup stays open, what we should probably do is add a multi-tenant system, so anyone who signs up would have to create their own company or receive an invitation to one.

- Two roles or three? The product notes settle on two for v1. Say whether you agree and what a third would be for.
  Two roles for now. But if we add invitations, we need someone to create and remove users, manage roles, etc., so an ADMIN who, besides being able to do what FINANCE and MANAGER do, also has access to all of this. For example, someone from FINANCE we want to give all this power to could directly be an ADMIN.

## During coding

### What I reused from Task 7

Almost all the auth: the Prisma and Supabase setup, register and login with argon2 and a JWT in an httpOnly cookie, the Zod validations, email normalization (trim + lowercase before validating) and the safe seed logic, the auth middleware, `/auth/me` and logout. I also applied the fixes from Telmo's Task 7 review from the start.

### What changed

- Roles are FINANCE and MANAGER. Signup always creates a MANAGER: the role is never read from the body and MANAGER is the database default.
- The only way to create a FINANCE account is the seed (`npm run seed:finance`). If the email belongs to a MANAGER it throws an error and changes nothing. If it is already FINANCE it updates the password.
- Ids are UUIDs instead of integers, so they don't reveal how many records exist (it's a financial app) and it's easier to add multiple agencies later.
- The login password now has a max of 64, because argon2 hashes whatever comes in and a huge password could be used to overload the server.

### UI decisions

This app will be used daily by real people to manage money, so I gave the UI more weight than in car-rental. I wrote the design decisions in `docs/DESIGN.md` (style, colors, money format, layout, components). The main ones: Spanish UI with English code, a sidebar layout because more modules are coming, and indigo as the brand color instead of green, because green already means "approved" in a finance app.

I added shadcn/ui as the component library. It uses Tailwind, which I already had, and it copies the components into the project so I own the code. It also solves components that are hard to build well (selects, dialogs, menus, date pickers), which this app will need soon.

### Frontend

- UI messages are in Spanish and live in `src/constants/messages.ts`. The API keeps its English messages; the frontend picks the text based on the status code (401 on login, 409 on register, etc.), so a network error or a non-JSON response never reaches the user as a technical message.
- New `GuestOnly` route guard: a logged-in user who opens `/login` or `/register` is sent to `/`.
- The forms validate the same rules as the backend (name 3-50, valid email, password 8-64) before sending.
- The new React Hooks lint rule (`set-state-in-effect`) flagged the session check from car-rental. The check on mount now updates state only when the response arrives, and `checkSession` is kept only for the "Reintentar" button.
- Not done yet: the sidebar layout from `DESIGN.md`. For now logout is on the home page.

### Tests

Backend (Postman):

- Register: valid data → 201 with MANAGER and a UUID; same email with different case → 409; sending `role: "FINANCE"` → still MANAGER; short password → 400.
- Seed: with a MANAGER's email → error, account unchanged.
- Login: FINANCE and MANAGER → 200 with the cookie; wrong password and unknown email → the same 401; email with spaces and uppercase → 200.
- `/auth/me`: with session → 200 without the password hash; without cookie or with a modified token → 401.
- Logout → 204, and then `/auth/me` → 401.

Frontend (browser):

- Register a new account → lands on the home page as Manager.
- Login with the FINANCE account → home shows the "Finanzas" role.
- Without session, opening `/` → redirected to `/login`. With session, opening `/login` → redirected to `/`.
- Invalid email or short password → field errors before sending.
- Wrong password → "Email o contraseña incorrectos."
- Backend off → error message with "Reintentar"; turning it on and retrying recovers without reloading.
- Logout → back to `/login`.
- Unknown URL → 404 page.

### Where AI helped

- Backend: I used Claude to review my code after each step, to think through UUID vs integer ids and multi-tenant, and to fix a Prisma 7 setup problem.
- Frontend: the structure and logic come from my car-rental code (auth context, route guards, login and register flow). To avoid writing the same code again, Claude helped me adapt it to this project: it wrote the status-based error handling with Spanish messages, the fix for the new set-state-in-effect lint rule, the GuestOnly guard and the FormField component, and rebuilt the pages with shadcn following DESIGN.md. I set up the project (Vite, Tailwind, shadcn), decided how to handle the messages, and reviewed and tested every flow.
- Design: Claude proposed the design system and made a visual mockup. I reviewed it and chose the options (sidebar, Spanish UI, shadcn with Base UI).
- Documentation: Doing the readme.md


## Review fixes

- Broken JSON on `/auth/register` or `/auth/login` returned 500, and the error log printed the raw body, so a password could end up in the logs. Added an error middleware right after `express.json()` that catches the parse error, returns 400 "Invalid JSON" and does not log anything.
- The FINANCE seed only checked the password length, so it could save an invalid email or name. I moved the register schema to `auth/authSchemas.ts` and the seed now validates with the same schema before the upsert. If the variables are invalid it stops and changes nothing.

