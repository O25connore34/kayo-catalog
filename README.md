# KAYO

Japan lodgings, tickets and routes at one desk. Next.js + PostgreSQL (PGlite locally, Docker Postgres optional). Locales: `ja`, `en`, `zh`.

```
npm.cmd run dev
```

Open http://127.0.0.1:3000 — it redirects to `/ja`.

Optional real Postgres:

```
docker compose up -d
```

Then set `DATABASE_URL` when a pg driver is wired; without it the app uses embedded PostgreSQL in `./data/pglite` (or `%USERPROFILE%\.kayo-pglite` if the project path is non-ASCII).
