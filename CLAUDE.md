# CLAUDE.md

Guidance for Claude Code (and other AI assistants) when working in this repository.

## What this is

The **Auth0 Authorization Extension** — an Auth0 extension providing RBAC and user group management. It ships as an Auth0 extension (a webtask): a Hapi backend plus a React frontend, bundled and served from a CDN.

The project is in **maintenance mode** (see `README.md`): no new features, only bug fixes and security patches. Keep changes minimal and focused.

## Layout

- `server/` — Hapi backend.
  - `server/api/` — API route modules, one folder per resource (`groups`, `roles`, `permissions`, `users`, `users-roles`, `groups-members`, `groups-nested`, `configuration`, etc.).
  - `server/lib/` — shared logic: `storage/` (storage contexts), `tools/` (incl. `s3-storage-context.js`), `auth0/`, `rules/`, `errors/`.
  - `server/plugins/` — Hapi plugins (`html.js`, `auth.js`, `storage.js`, `assets.js`, …).
  - `server/views/index.js` — HTML template; references the CDN-hosted UI assets by version.
- `client/` — React + Redux frontend (`components/`, `containers/`, `actions/`, `reducers/`, `store/`).
- `webtask.js` — extension entry point (the webtask factory).
- `webtask.json` — extension manifest (secrets schema, scopes, storage options).
- `build/` — webpack configs; `tools/` — `cdn.sh` (deploy) and `get_version.js`.
- `dist/` — **committed** built bundles (backend extension + frontend UI assets), versioned in the filename.
- `tests/unit/`, `tests/integration/` — Mocha test suites.

## Runtime & tooling

- **Node 22** (`engines` in `package.json`, `.nvmrc`). Run `nvm use`.
- Package manager: **npm** (`package-lock.json` is committed; use `npm ci` for clean installs).
- Language: ES modules + JSX transpiled via Babel (`@babel/register` in tests, webpack for builds).
- Backend framework: **Hapi** (`@hapi/hapi`). Lint: ESLint (`.eslintrc`).

## Common commands

- `npm test` — unit tests (Mocha + nyc coverage).
- `npm run test:watch` — unit tests in watch mode.
- `npm run test:integration` — integration tests.
- `npm run lint:js` / `npm run lint:fix` — lint (and autofix).
- `npm run build` — full build: `clean` → `client:build` (webpack) → `extension:build`.
- `npm run serve:dev` / `npm run serve:prod` — run locally (see `README.md` for the Cloudflare tunnel setup and `server/config.json`).

Always run `npm test` and `npm run lint:js` before proposing PR-ready changes.

## Externals / dependencies (important)

`package.json` has an **`auth0-extension.externals`** array. These packages are **not bundled** — at runtime they are resolved from the extension host's module store, and the built backend bundle emits them as `require("name@version")` strings. Consequences:

- To change an external's version, update **both** `auth0-extension.externals` **and** the matching entry in `dependencies` (keep them in sync), then rebuild.
- An external version is only usable if it exists in the host module store; do not bump an external to a version that isn't available there.
- A dependency **not** in the externals list (e.g. UI libraries, `@hapi/inert`) **is** bundled, so changing it alters the bundle contents.

## Releasing a new version

The version lives in several places that must move together:

1. `version` in `package.json`.
2. `EXTENSION_VERSION` in `server/plugins/html.js`.
3. Add a `CHANGELOG.md` entry.
4. `npm run build` to regenerate `dist/` (bundle filenames, `manifest.json`, and the embedded version all reflect the new number). Commit the rebuilt `dist/`.

Follow **conventional commits** (`feat:`, `fix:`, `chore:`, …).

## Testing notes

- AWS SDK v3 code (`server/lib/tools/s3-storage-context.js`) is unit-tested with `aws-sdk-client-mock`; the SDK is never hit for real in tests.
- The extension supports two storage backends (`STORAGE_TYPE`): `webtask` and `s3`. The S3 path only runs when configured for S3.

## Conventions

- Prefer `async/await` over callbacks.
- Match the surrounding code's style; keep diffs small and scoped (maintenance mode).
- Don't commit secrets. `server/config.json` is local-only and gitignored.
