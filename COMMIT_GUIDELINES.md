# Commit Guidelines

These rules apply to **everyone** working on this project — humans and AI agents
alike. Keep history clean, readable, and safe.

## Format — Conventional Commits

Every commit message follows:

```
<type>(<scope>): <subject>

<body>

<footer>
```

Only the first line (`<type>(<scope>): <subject>`) is required.

### Subject line

- Use the imperative mood: "add", "fix", "remove" — not "added" or "adds".
- No capital letter after the colon, no trailing period.
- Keep it under ~72 characters.
- Describe *what* the change does, not *how*.

### Types

| Type       | Use for                                                        |
|------------|---------------------------------------------------------------|
| `feat`     | A new feature or user-facing capability                       |
| `fix`      | A bug fix                                                     |
| `chore`    | Tooling, config, ignores, housekeeping (no app behavior)     |
| `refactor` | Code change that neither fixes a bug nor adds a feature      |
| `style`    | Formatting, whitespace tweaks (no logic change)              |
| `docs`     | Documentation only                                           |
| `perf`     | A change that improves performance                           |
| `test`     | Adding or fixing tests                                       |

### Scopes

Use the area of the codebase the change touches. Common scopes here:

- `account-v1` — `src/account-v1/`, Riot ID → account lookup
- `match-v5` — `src/match-v5/`, match IDs and match detail
- `league-v4` — `src/league-v4/`, ranked entries
- `common` — `src/common/`, shared DTOs and validation
- `utils` — `src/utils/`, `config.ts` regional routing, `getJson.ts` fetch helper
- `app` — `src/main.ts`, `src/app.module.ts`, bootstrap, CORS, env loading

Scope is optional but encouraged. Omit it for repo-wide changes.

### Body (optional)

- Separate from the subject with one blank line.
- Explain the *why* and any context a reviewer needs.
- Wrap at ~72 characters.

## One logical change per commit

Split work into commits that each stand on their own:

- Group related files (e.g. a controller with the DTOs it consumes).
- Don't mix unrelated changes — a bug fix and a new feature are two commits.
- Each commit should leave the app compiling and running.

## Never commit secrets

- The Riot API key lives in `.env`, which is **gitignored** — never force-add it.
- Don't hardcode keys, tokens, or credentials in source. `src/utils/config.ts`
  reads `RIOT_API_KEY` from the environment (loaded from `.env` by
  `@nestjs/config`); keep it that way.
- If a secret is ever committed by mistake, rotate it immediately and scrub it
  from history.

## Attribution

Commit as yourself — do not add AI co-author trailers (`Co-Authored-By: ...`)
or other generated-by footers to commit messages.

## Examples

```
feat(league-v4): add ranked entry endpoint
```

```
fix(app): load .env via @nestjs/config so the Riot key reaches requests

Nest does not read .env by itself; RIOT_API_KEY was always empty and
every upstream call failed with 401. Register ConfigModule.forRoot()
globally so the key is loaded at bootstrap.
```

```
chore: ignore .env containing the Riot API key
```
