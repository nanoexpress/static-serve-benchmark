# PR: Modernize toolchain — bun, latest deps, Biome + rumdl + lefthook

## Changes

### 1. bun as package manager

- Added `packageManager: bun@1.4.2`; `bun.lock` regenerated (was already bun-based).
- `.DS_Store` added to `.gitignore`.

### 2. Dependency upgrades

| Package | Before | After |
|---|---|---|
| uWebSockets.js (git tag) | v20.61.0 | **v20.70.0** |

- **v20.61.0 cannot load on this machine at all** — it ships no `darwin-arm64` binary for Node.js 26 (ABI 147). v20.70.0 is the newest tag that both ships Node 26 binaries **and** still has a working ESM wrapper (`import uws from './uws.js'`); v20.71.0's git-tag ESM wrapper imports a CI-built `index.js` that is not committed to the repository, so git-tag installs of it are broken upstream.

### 3. New toolchain

- **Added:** Biome 2.5 (`biome.json`; vendored `static/` and `.vscode/` excluded), rumdl 0.2 (`rumdl.toml`), lefthook 2.1 (`lefthook.yml` pre-commit: `biome check --write` on staged JS/JSON, `rumdl check` on staged Markdown). This repo previously had no formatter/linter config at all.
- **Scripts added:** `lint`, `format`, `prepare` (lefthook), and `serve:*` shortcuts (`serve:bun` via Bun, `serve:zccache|fscache|fsread|stream` via Node — uWebSockets.js uses ABI-specific native binaries, which Bun cannot load by design).
- Code fixes from first `biome check`: `node:` protocol imports, removed unused imports, formatting.

## Verification

- `bun src/bun.js` boots and serves **HTTP 200** on `https://localhost:4400`.
- uWebSockets.js v20.70.0 loads and `SSLApp().listen()` succeeds under Node.js 26 (baseline v20.61.0 failed to load entirely).
- Full uWS server boot remains blocked by the pre-existing `bufferfromfile` dependency (its WTools-generated `.ss` entry point fails under Node ESM; 0.4.377 is the latest published version) — unchanged by this PR and present at baseline.

## Metrics (measured on this machine)

| Operation | Before | After | Δ |
|---|---|---|---|
| lint + format | none (no tooling) | `biome check .` **0.09s** (11 files) | new capability |
| markdown lint | none | `rumdl check .` 0.09s | new capability |
| git hooks | none | lefthook pre-commit auto-fix + markdown gate | new capability |
| uWS on Node 26 | failed to load | loads + listens | fixed |
