# Countries Dashboard — React + TypeScript + Vite

A small, production-minded React + TypeScript application scaffolded with Vite. This README explains the project's goals, main features, technical highlights, and how to run it locally or in Docker.

---

## Key highlights / What stands out

- Virtual scroll for large-data performance
  - The UI uses windowing to keep the DOM small and rendering fast when showing long lists of countries.
- Autocomplete with suggestion highlighting
  - Fast, debounced search with suggestion highlighting and keyboard support (arrow keys, Enter, Escape).
- React best practices
  - `React.StrictMode` enabled at the app root to surface unsafe lifecycles and other issues in development.
  - Type-safe code with TypeScript and strict compiler settings.
  - Controlled performance optimizations: `React.memo`, `useMemo`, `useCallback` used where useful.
  - Code-splitting and lazy-loading patterns (where appropriate) with `React.lazy` + `Suspense` for better initial load performance.
- Robust error handling and loading states
  - Error boundaries + granular fallbacks for graceful degradation.
  - Explicit loading/empty states and edge-case handling (network errors, cancelled requests, empty results).
- Docker-ready
  - A `Dockerfile` is provided so the app can be run inside a container for a consistent environment.

---

## Quick start — install & run

Install dependencies:

```bash
npm install
```

Start dev server (Vite + HMR):

```bash
npm run dev
```

Build production bundle:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Notes:
- Use the dev server for local development (hot reload and better dev ergonomics). The preview command serves the optimized production build for a closer-to-prod check.

---

## Docker — build and run

This project includes a `Dockerfile` so the app can be run inside a container for a consistent environment.

Build the Docker image:

```bash
docker build -t countries-dashboard:latest .
```

Run the container (serves the production build):

```bash
docker run --rm -p 5173:5173 countries-dashboard:latest
```

Optional: use Docker Compose if you add `docker-compose.yml` to wire up other services (API mocks, etc.):

```bash
docker compose up --build
```

Notes:
- The container runs the production build — use `npm run dev` locally for HMR and debugging.
- If you need to expose a different port, change the `-p` mapping above.

---

## Main features and UX decisions

1. Virtual scroll (large-data performance)
   - Implementation reduces number of DOM nodes when rendering long lists of countries.
   - Improves paint/layout times and memory use; suitable for datasets with hundreds or thousands of rows.
   - Look for the component that implements windowing/window-size calculations and the list item virtualization logic.

2. Autocomplete & suggestions highlighting
   - Debounced input to avoid spamming the API.
   - Requests are cancellable (AbortController) to avoid race conditions and wasted renders.
   - Matched substrings are highlighted in the suggestion list for clarity and accessible feedback.
   - Keyboard-first UX: arrow navigation, Enter to accept, Escape to close.

3. Error handling & loading
   - Global Error Boundary for uncaught rendering errors and local fallbacks for recoverable operations.
   - Loading skeletons/spinners and explicit empty-state UI for clarity.
   - Network errors surfaced with retry affordances where meaningful.
   - Edge cases handled: empty API responses, slow networks (timeouts), request cancellation.

4. React & TypeScript best practices
   - `StrictMode` enabled in `src/main.tsx` or `src/App.tsx`.
   - Hooks follow rules-of-hooks and use custom hooks for common logic (e.g., `useDebounce`, data fetching hooks).
   - Type definitions in `src/types` for domain models (countries) to keep components type-safe and self-documenting.

---

## Key files / entry points to inspect

- `src/App.tsx` — application shell, top-level providers, routing, and where `StrictMode` and `Suspense` are wired.
- `src/main.tsx` — app bootstrap and providers.
- `src/components/CountryCard.tsx` — single country rendering and accessibility details.
- `src/components/SearchBar.tsx` — autocomplete + suggestion highlighting logic.
- `src/components/SortControls.tsx` — sorting UI and behavior.
- `src/components/Loading.tsx`, `src/components/ErrorMessage.tsx` — consistent loading and error UI.
- `src/hooks/useDebounce.ts` — debounced search implementation.
- `src/services/api.ts` — network fetching with AbortController support and error normalization.
- `src/types/country.ts` — domain types and shapes.

---

## Testing & linting

Run tests (if present):

```bash
npm test
```

Run lint:

```bash
npm run lint
```

The project includes ESLint and TypeScript configurations designed for type-aware linting. See `eslint.config.js`, `tsconfig.app.json`, and `tsconfig.json`.

---

## Troubleshooting & tips

- Port conflict: change `-p` in the `docker run` command or update the dev server port in `vite.config.ts`.
- If HMR acts up, restart the dev server (`npm run dev`) and clear the Vite cache (`rm -rf node_modules/.vite`).
- For Docker-related issues, ensure Docker Desktop is running and that your user can run Docker commands.

---

## Final notes — project highlights and rationale

- Demonstrates practical performance engineering (virtual scroll, memoization) and attention to UX (autocomplete, highlighting, keyboard navigation).
- Follows React/TypeScript best practices (Strict Mode, typed hooks, clear separation of concerns).
- Docker support demonstrates how to package the app for CI and consistent runs.
- Robust error and loading states show attention to real-world edge cases.
