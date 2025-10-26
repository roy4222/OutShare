# Repository Guidelines

## Project Structure & Module Organization
- `app/` houses Next.js route segments; keep page-specific logic inside each segment (e.g. `app/GearDashboard`).
- Shared UI lives in `components/`; icons and logos are under `asset/`, while static files stay in `public/`.
- Utilities and data seeds sit in `lib/` and `data/`; database assets are in `prisma/`, and deployment config in `supabase/`, `wrangler.*`, and `open-next.config.ts`.

## Build, Test, and Development Commands
- `npm run dev` launches the local Next.js server on `0.0.0.0`.
- `npm run build` triggers Prisma codegen then builds the production bundle—run it before every PR.
- `npm run start` or `npm run preview` executes the Cloudflare-ready worker build.
- `npm run lint`, `npm run prisma:migrate`, and `npm run supabase:start|stop` cover linting, schema migrations, and the Supabase emulator.

## Coding Style & Naming Conventions
- TypeScript, React 19, and Next.js 15 are standard; default to server components and opt into `use client` only when hooks require it.
- Use 2-space indentation, trailing commas, and named exports for shared helpers.
- Follow Tailwind utilities defined in `app/globals.css`; colocate one-off styles with the component.
- Name segments in PascalCase, utilities in kebab-case (e.g. `lib/supabase/client.ts`), and keep environment templates under `.env.example` patterns.

## Testing Guidelines
- No dedicated test runner ships yet; add Jest or Playwright coverage when behavior changes or regressions are likely.
- Place tests alongside the source (`components/Button/__tests__/Button.test.tsx`) and mirror the component name.
- Always run `npm run build` and validate auth, gear, and trip flows against the Supabase emulator before review.
- Record manual verification steps in the PR when automated coverage is unavailable.

## Commit & Pull Request Guidelines
- Follow the existing conventional commit format (`feat:`, `refactor:`, `fix:`) with concise, action-led summaries.
- Keep commits focused on a single concern; exclude generated Prisma clients or build artifacts.
- PRs should describe intent, flag schema or configuration changes, and attach screenshots or clips for UI updates.
- Link relevant issues or OpenSpec change IDs and confirm lint/build commands succeed before requesting review.

## Platform & Environment Notes
- Prisma models back Supabase tables; update `schema.prisma` and run `npm run prisma:generate` after edits.
- Cloudflare Workers host the app—verify worker behavior via `npm run start` or `npm run preview`.
- Store secrets only in local `.env` files referenced by Supabase scripts; never commit credentials.

一律用繁體中文回答