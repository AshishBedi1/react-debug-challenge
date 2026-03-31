# React debugging challenge (Savyre)

## Install

```bash
npm install
```

Install Playwright browsers (Chromium is used by the E2E suite):

```bash
npx playwright install chromium
```

## Dev server

```bash
npm run dev
```

Vite defaults to `http://localhost:5173` (see terminal output).

## End-to-end tests (`@playwright/test`)

```bash
npm run test:e2e
```

Tests live under `e2e/`. The config file is `playwright.config.ts` at the repo root.

### `BASE_URL` (and optional alias)

Playwright reads the app base URL from the environment:

- **`BASE_URL`** — primary variable for local and CI runs.
- **`PLAYWRIGHT_BASE_URL`** — optional alias; same meaning as `BASE_URL`.

If neither is set, the default is `http://127.0.0.1:5174` so `npm run test:e2e` can start its own Vite instance without colliding with another process on port `5173`.

**Examples**

- Run against a server you already started on port 5173:

  ```bash
  set PW_SKIP_WEB_SERVER=1
  set BASE_URL=http://127.0.0.1:5173
  npm run test:e2e
  ```

  On macOS/Linux:

  ```bash
  PW_SKIP_WEB_SERVER=1 BASE_URL=http://127.0.0.1:5173 npm run test:e2e
  ```

- Optional: change the auto-started dev port (default `5174`):

  ```bash
  set PW_E2E_PORT=5180
  npm run test:e2e
  ```
