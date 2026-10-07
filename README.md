# Artist Management App

Platform for an artist management agency to manage the economic relationship with its artists. Task 1: accounts and roles.

## Stack

- Backend: Node, Express 5, TypeScript, Prisma 7, PostgreSQL (Supabase), Zod, argon2, JWT in an httpOnly cookie.
- Frontend: React 19, Vite, TypeScript, React Router, Tailwind CSS, shadcn/ui (Base UI).

## Structure

- `backend/`: REST API.
- `web/`: frontend.
- `docs/PROCESS.md`: decisions, tests and process for each task.
- `docs/DESIGN.md`: UI design decisions.

## Roles

- MANAGER: created through signup. Signup always creates a MANAGER, even if a role is sent.
- FINANCE: can only be created with the seed script.

## Setup

Requirements: Node 20+ and a PostgreSQL database (I use Supabase with the session pooler).

### Backend

```bash
cd backend
npm install
cp .env.example .env
```

Fill in `.env`:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `PORT` | API port (default 3000) |
| `CORS_ORIGIN` | Frontend URL (default `http://localhost:5173`) |
| `JWT_SECRET` | Long random string. Generate one with `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `FINANCE_NAME`, `FINANCE_EMAIL`, `FINANCE_PASSWORD` | Data for the FINANCE account created by the seed (password 8-64 characters) |

Run the migrations and generate the Prisma client:

```bash
npx prisma migrate deploy --config prisma7.config.ts
npx prisma generate --config prisma7.config.ts
```

Note: in Prisma 7, `migrate` does not generate the client. Run `prisma generate` after every new migration.

Create the FINANCE account:

```bash
npm run seed:finance
```

If the email already belongs to a MANAGER, the seed stops with an error and changes nothing. If it is already FINANCE, it updates the password.

Start the API:

```bash
npm run dev
```

### Frontend

```bash
cd web
npm install
cp .env.example .env
```

Set `VITE_API_URL` in `.env` (for example `http://localhost:3000`), then:

```bash
npm run dev
```

Open `http://localhost:5173`.

