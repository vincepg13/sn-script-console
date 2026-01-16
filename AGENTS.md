# Repository Guide (AGENTS)

## Overview
- ServiceNow Script Console: React 19 + TypeScript frontend and ServiceNow SDK 4.x backend metadata in one repo via ServiceNow Fluent.
- Target users: ServiceNow pro-code developers; focuses on fast editing of script-based records.
- Includes a global Script Include (`ScriptConsoleG`) required for cross-scope access in ServiceNow.

## Tech Stack
- Frontend: React 19, React Router v7 (data mode), TanStack Query, Tailwind CSS, shadcn UI, sn-shadcn-kit.
- Tooling: Vite, TypeScript, ESLint, Prettier.
- ServiceNow: SDK 4.x, Fluent metadata definitions.

## Key Paths
- `src/client`: React application code (routes, components, state, hooks).
- `src/fluent`: ServiceNow Fluent metadata (server-side app definitions).
- `public`: static assets, screenshots, update set XMLs.
- `scripts`: build/utility scripts (e.g., build confirmation).
- `dist` / `target`: build artifacts.

## Common Commands
- Dev server: `npm run dev`
- Build (SDK): `npm run build`
- Deploy to instance: `npm run deploy`
- Transform metadata: `npm run transform`

## Build Process Notes
- Uses a ServiceNow-provided custom Rollup config, with local adjustments in `now.prebuild.mjs`.
- Dependencies should be installed as `devDependencies` in this repo (use `npm i -D`).

## React App Architecture
- Entry and bootstrapping: `src/client/main.tsx`, `src/client/index.html`.
- Routing and data loading: `src/client/router.tsx`, `src/client/routes`.
- Layout and UI building blocks: `src/client/layout`, `src/client/components`.
- State and data: `src/client/queryClient.ts`, `src/client/hooks`, `src/client/context`.
- Styling: `src/client/index.css`, `src/client/styles`, `src/client/tailwind.config.cjs`.
- Core dependencies: React Router v7, TanStack Query, shadcn UI, sn-shadcn-kit, Tailwind CSS.

## ServiceNow Metadata Architecture
- Defined with ServiceNow Fluent in `src/fluent/index.now.ts`.
- Grouped by metadata type in `src/fluent`:
  - `access-controls`
  - `properties`
  - `rest-apis`
  - `script-includes`
  - `ui-pages`
  - `generated` (SDK output)

## ServiceNow Configuration Notes
- Replace the scope prefix `x_659318` with your instance prefix when building your own version.
- System properties control menus and scriptable tables:
  - `x_659318_script.stats_tables`
  - `x_659318_script.script_tables`
  - `x_659318_script.app_menu`
- Update set install is supported via the update set in  `public`.

## Routes (High Level)
- `/`: homepage dashboards and editor configuration
- `/script`: script editor for a table record
- `/widget_editor`: optimized widget editor
- `/policy`: UI policy + actions builder
- `/property`: JSON-friendly property editor
- `/list` and `/form`: list view and fallback form view
