# Arkite Admin Starter

A **Next.js admin panel starter** built on [`@arkite-ui/core`](https://www.npmjs.com/package/@arkite-ui/core) — React components for multi-tenant SaaS admin dashboards (Tailwind CSS v4 + Radix UI + TypeScript).

Clone it, run it, and you have a working back-office in two minutes: an admin layout with desktop sidebar and mobile bottom tabs, a server-side paginated data table, a settings form, and a stats dashboard. Every visual comes from the component library — **zero custom CSS in this repo**.

**[Live demo →](https://starter.foson.co)** · **[Component library docs →](https://ui.foson.co)** · **[Storybook →](https://ui.foson.co/storybook/)**

## Quick start

Click **Use this template** on GitHub (or clone), then:

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

## What's inside

| Page | Demonstrates |
|------|--------------|
| `/` Dashboard | `StatGroup`/`StatCard` KPIs, `Sparkline`, `Timeline` activity feed |
| `/users` | **Server-side table**: `useServerTable` + `DataTable` (`totalRows`, `compact`, `rowClassName`, column filters with `filterOptions`) against a mock API route |
| `/settings` | `Form` family (`FormField`/`FormLabel`/`FormControl`), `Select`, `Switch`, `toast.success` / `toast.fromError` |
| Shell | `AdminLayout` with Next.js `Link` integration (`renderLink`), `hideSidebar="mobile"` + `bottomNav` for the desktop-sidebar / mobile-tabs pattern |

## Where your code goes

This starter is deliberately **pure UI** — the library's design principle. The seams for your domain layer are marked with comments:

- **Auth** → `app/shell.tsx` (`user`, `hasPermission`, `onLogout` on `AdminLayout`)
- **API** → replace `app/api/users/route.ts` (mock) with your backend; the query contract (`page`/`pageSize`/`sort`/`filters`) comes from `useServerTable`
- **Error copy** → `toast.configure({ formatError })` in `app/shell.tsx`, wired once

## AI-ready

The component library ships machine-readable docs: point your coding agent at
[`ui.foson.co/llms-full.txt`](https://ui.foson.co/llms-full.txt) (or `node_modules/@arkite-ui/core/llms-full.txt` after install) and it will use the right components with the right props — the docs are regenerated from the type-checked API on every library build.

## License

MIT © [Foson](https://foson.co)
