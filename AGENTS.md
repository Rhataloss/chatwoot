# Chatwoot Development Guidelines

## Architecture

Chatwoot is a **Rails 7.1 monolith** with multiple Vite-powered Vue 3 frontends. Key boundaries:

- `app/` — Rails backend: models, controllers, services, jobs, channels, etc.
- `app/javascript/dashboard/` — Main agent dashboard SPA (Vue 3 + Vuex + Pinia coexistence)
- `app/javascript/widget/` — Embeddable customer widget
- `app/javascript/portal/` — Help center portal
- `app/javascript/sdk/` — JS SDK (built separately via `pnpm build:sdk`)
- `app/javascript/shared/` — Shared JS/Vue utilities across frontends
- `app/javascript/design-system/` — Design system components
- `enterprise/` — Enterprise overlay (extends/overrides OSS code, see Enterprise section below)
- `spec/` — Ruby RSpec tests; `app/**/*.{test,spec}.js` — JS Vitest tests

Services: PostgreSQL (with pgvector), Redis, Sidekiq, Vite dev server.

## Build / Test / Lint

- **Setup**: `bundle install && pnpm install`
- **DB setup**: `make db` (runs `rails db:chatwoot_prepare`) or `bin/setup`
- **Run Dev**: `pnpm dev` or `overmind start -f ./Procfile.dev` (starts Rails on :3000, Vite on :3036, Sidekiq)
- **Seed Local Test Data**: `bundle exec rails db:seed`
- **Seed Search Test Data**: `bundle exec rails search:setup_test_data`
- **Seed Account Sample Data**:
  - CLI: `bundle exec rails runner "Internal::SeedAccountJob.perform_now(Account.find(<id>))"`
  - Or: `Seeders::AccountSeeder.new(account: Account.find(<id>)).perform!`
- **Lint JS/Vue**: `pnpm eslint` / `pnpm eslint:fix`
- **Lint Ruby**: `bundle exec rubocop -a`
- **Test JS**: `pnpm test` (Vitest, jsdom, globals enabled) or `pnpm test:watch`
- **Test Ruby**: `bundle exec rspec spec/path/to/file_spec.rb`
- **Single Ruby Test**: `bundle exec rspec spec/path/to/file_spec.rb:LINE_NUMBER`
- **Makefile shortcuts**: `make setup`, `make db`, `make db_seed`, `make db_reset`, `make run`, `make force_run`

### Environment

- **Ruby**: 3.4.4 (via `rbenv`). Run `eval "$(rbenv init -)"` before `bundle`/`rspec` commands.
- **Node**: 24.x, **pnpm**: 10.x (see `package.json` engines)
- **Always** use `bundle exec` for Ruby CLI tasks.

## Code Style

- **Ruby**: RuboCop (150 char max line length, custom cops in `rubocop/`). Compact `module/class` definitions (no nested style).
- **Vue/JS**: ESLint (airbnb-base/legacy + vue3-recommended + prettier). Composition API with `<script setup>` only.
- **Vue Components**: PascalCase. Events: camelCase. Block order: script → template → style.
- **I18n**: No bare strings in templates; use i18n. Backend → `en.yml`, Frontend → `en.json`.
- **Styling**: Tailwind utility classes only. No custom CSS, no scoped CSS, no inline styles. Colors defined in `tailwind.config.js` (imports from `theme/colors`).
- **Error Handling**: Custom exceptions in `lib/custom_exceptions/`.
- **Tests**: Prefer `let` values over custom helpers. Prefer `with_modified_env` over stubbing `ENV`. Specs in parallel: compare `error.class.name` not constant equality.

## General Guidelines

- Smallest production-ready change that solves the problem.
- Prefer direct reads (`find`, `find_by!`) over silent fallbacks for required configs.
- Prefer existing repo dependencies over hand-rolled protocol code.
- Avoid writing specs unless explicitly asked.
- Avoid one-use private helpers unless they meaningfully reduce complexity.

## Commit Messages

- Conventional Commits: `type(scope): subject` (scope optional).
- Do not reference AI tools in commit messages.

## PR Description Format

- Short user-facing paragraph describing the change.
- `Closes` section with issue links.
- Feature PRs: `How to test`. Bugfix PRs: `How to reproduce`.
- No `How this was tested` section listing specs/commands.

## Project-Specific

- **Translations**: Only update `en.yml` (backend) and `en.json` (frontend). Other languages are managed via Crowdin. Do not flag Crowdin-synced PRs for modifying non-English locales.
- **Frontend**: Use `components-next/` for message bubbles (rest of `components/` is being deprecated).
- **JS Tests**: Vitest with jsdom, globals enabled, `fake-indexeddb` and `vitest.setup.js` as setup files. Tests run in threads.
- **Ruby Tests**: RSpec with FactoryBot (`create`, `build`), test-prof (`before_all`, `let_it_be`), shoulda-matchers, and Skooma for OpenAPI validation in request specs.

## Enterprise Edition

Chatwoot has an Enterprise overlay under `enterprise/` that extends/overrides OSS code.

**Checklist for changes impacting core logic or public APIs:**
- Search both trees before editing: `rg -n "FooService|ControllerName|ModelName" app enterprise`
- Consider if Enterprise needs an override (`enterprise/app/...`) or extension point (`prepend_mod_with`, hooks, config)
- Avoid hardcoding plan-specific behavior in OSS; use feature flags or extension points
- Keep request/response contracts stable across OSS and Enterprise
- Mirror renames/moves in `enterprise/` to prevent drift
- Enterprise-specific specs go under `spec/enterprise/`
- For Enterprise-only behavior on existing OSS features, use `prepend_mod_with`/`include_mod_with` modules — don't edit OSS files directly
- Enterprise-exclusive features: place directly under `enterprise/`

## Branding / White-labeling

For user-facing strings containing "Chatwoot" that should adapt to branded installs, use `replaceInstallationName` from `shared/composables/useBranding` in the UI layer instead of hardcoded brand copy.

## Sync Note

Keep `CLAUDE.md` identical to this file.
