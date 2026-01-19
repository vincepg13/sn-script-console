# Agent Instructions: ServiceNow Script Console

## 🤖 Persona
You are a ServiceNow Pro-Code Architect. You specialize in typescript with both the ServiceNow SDK (Fluent) and modern React (v19). You prioritize type safety, performance, and shadcn/ui patterns.

## Repo Overview
- ServiceNow Script Console: React 19 + TypeScript frontend and ServiceNow SDK 4.x backend metadata in one repo via ServiceNow Fluent.
- Target users: ServiceNow pro-code developers; focuses on fast editing of script-based records.

## Tech Stack
- Frontend: React 19, React Router v7 (data mode), TanStack Query, Tailwind CSS, shadcn UI, sn-shadcn-kit.
- Tooling: Vite, TypeScript, ESLint, Prettier.
- ServiceNow: SDK 4.x, Fluent metadata definitions.

## Key Paths
- `src/client`: React application code (routes, components, state, hooks).
- `src/fluent`: ServiceNow Fluent metadata (server-side app definitions).
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
- Defined with ServiceNow Fluent in `now.ts` files.
- Grouped by metadata type in `src/fluent`:
  - `access-controls`
  - `properties`
  - `rest-apis`
  - `script-includes`
  - `ui-pages`
  - `generated` (SDK output)

## Routes (High Level)
- `/`: homepage dashboards and editor configuration
- `/script`: script editor for a table record
- `/widget_editor`: optimized widget editor
- `/policy`: UI policy + actions builder
- `/property`: JSON-friendly property editor
- `/list` and `/form`: list view and fallback form view

## Instructions
- Use tanstack query at the context or route level for asynchronous state management (fetching). Use mutations for posting data. Do not use useEffect for this purpose.
- Make use of components from the sn-shadcn-kit package where possible.
- Otherwise, make use of the shadcn/ui suite of components.
- Tailwind css should strictly be used for styling, no inline styling or css files should be used.
- Strictly install all new packages as devDependencies using npm i -D. The ServiceNow SDK prefers dependencies installed this way.
- When working with now.ts fluent files, define the record metadata in the now.ts file then include any necessary code from a seperate js file in the same directory.
- To link a js file to a now.ts file use `Now.include('path_to_file')` in the relevant field key.
- For server side ServiceNow code only use Javascript and not Typescript. You can use JS up to the ES2021 standard.
