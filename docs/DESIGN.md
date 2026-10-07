# UI design

Reference for building screens. Decide once, apply everywhere.

## Principles

- Data first: amounts and statuses are what users look at most. Everything else stays in the background.
- Statuses must be readable at a glance, always with color and text (never color alone).
- Consistency: the same button, field or badge looks the same everywhere, so they are built once as components.

## General decisions

- Sober and professional style, like a financial back-office.
- UI text in Spanish (users are from an Argentine agency). Code in English.
- Light mode only for now. Colors are defined as theme variables so dark mode can be added later.
- Desktop first, but nothing should break on mobile.
- Component library: shadcn/ui (Base UI + Tailwind, preset Vega). Components are copied into `src/components/ui` and can be edited.

## Color

- Colors come from the shadcn theme variables in `src/index.css`. In code, use the shadcn classes instead of raw Tailwind colors:
  - Background: `bg-background`. Cards: `bg-card`.
  - Text: `text-foreground`. Secondary text: `text-muted-foreground`.
  - Borders: `border-border`.
  - Primary actions: `bg-primary` / `text-primary-foreground`.
- Base: neutral grays (shadcn "neutral" base color).
- Brand: indigo (`indigo-600`, set as `--primary`). Only for primary actions, links and the active sidebar item.
- Status colors are reserved for statuses only:
  - Amber: pending
  - Green: approved / collected
  - Red: rejected / error
  - Gray: draft / inactive
- Brand is not green on purpose: in a finance app green already means "approved".

## Money and dates

- Always show the currency: `ARS 150.000,00`, `USD 1.200,00`.
- Format with `Intl.NumberFormat("es-AR")` in a single `formatMoney` helper.
- In tables, amounts are right-aligned with `tabular-nums`.
- Dates as `dd/mm/aaaa`.

## Typography

- One font: Inter (installed with `@fontsource-variable/inter`, comes with the Vega preset).
- Base text `text-sm` (14px). Page titles `text-xl` / `text-2xl`.

## Layout

- Fixed left sidebar (~240px) with the app name and modules.
- Top bar with the page title and, on the right, user name, role badge and logout.
- Login and register outside the layout: a centered card with the app name.
- On mobile the sidebar collapses behind a menu button.

## Base components (Task 1)

From shadcn/ui (`src/components/ui`): Button, Input, Label, Card, Badge, Alert.
Ours (`src/components`), built on top of those: FormField (label + input + error message), Sidebar, the app layout, and an error state with "Reintentar" for when the backend is unavailable.

Rule: before building a component, check if shadcn has it. If it does, add it with `npx shadcn@latest add <name>` and adapt it, instead of building it from scratch.

## Copy

- Errors say what happened and what to do: "No pudimos conectar con el servidor. Intentá de nuevo."
- Buttons start with a verb: "Iniciar sesión", "Guardar", "Reintentar".
- All user-facing messages live in `src/constants/messages.ts`. The API returns status codes and technical messages in English; the frontend picks the Spanish text based on the status code.
