# OOUTH Backend

Hospital API for the OOUTH corporate services frontend. Express, TypeScript, Prisma, and PostgreSQL. Clinical rows are append-only. Every mutation writes an audit event. Permissions are checked on the server.

## Requirements

- Node.js 22
- PostgreSQL 17

## Setup

```powershell
copy .env.example .env
npm install
npx prisma migrate deploy
npx tsx prisma/seed.ts
npm run dev
```

Set `DATABASE_URL` in `.env` to a database you can create. The API connects with that URL only. `PGHOST`, `PGUSER`, `PGPORT`, and `PGDATABASE` stay in `.env` for `npm run db:azure` and are not used at startup. A successful start prints `Database connected using DATABASE_URL` with the host, port, and database name. `npm start` applies the Prisma migrations before the process listens. The first boot of an empty database also loads departments, fees, and the preview staff. The API listens on port 4000. Swagger is at `http://localhost:4000/api/docs`. Consultation calls use Socket.IO on that same origin. Set `TURN_SERVER_URL`, `TURN_USERNAME`, and `TURN_CREDENTIAL` when a TURN relay is available. Leave them blank to use STUN only. Every route is documented in `docs/API.md`.

Azure Database for PostgreSQL on `db-aro.postgres.database.azure.com` uses a Microsoft Entra token as the password. Set `PGUSER` to the Entra admin, install Azure CLI, run `az login`, then `npm run db:azure`. That writes `DATABASE_URL` with `sslmode=require`. The token expires in about one hour, so run the command again when the API can no longer connect. Generate `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, and `VIDEO_TOKEN_SECRET` locally with `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"`. `VIDEO_TOKEN_SECRET` is not issued by WebRTC. The browser still opens the camera with `getUserMedia`. The API only signs a short-lived HMAC token with that secret. Paystack keys that contain `dummy` are treated as unset, so card payment stays unavailable until a real secret is added.

The seed reads department copy from the sibling `OOUTH-frontend/content/departments.ts` folder and creates the demonstration staff. Their password is `DEMO_STAFF_PASSWORD`. Quote that value in `.env` because `#` would otherwise start a comment. The sign-in buttons call the normal login route.

This machine also has a project-local PostgreSQL cluster in `.pgdata` on port 5433. Start it with:

```powershell
& "C:\Program Files\PostgreSQL\17\bin\pg_ctl.exe" -D .pgdata -l .pgdata\server.log start
```

## Scripts

- `npm run dev` starts the API with `tsx watch`
- `npm test` runs the Vitest and Supertest suite
- `npm run build` compiles TypeScript

## Providers that stay unwired

- Redis and BullMQ start only when `REDIS_URL` is set. Otherwise mail and payment follow-up run in the API process.
- SMS is a no-op sender. No Nigerian gateway is called.
- Documents are stored in PostgreSQL. The Azure Blob adapter exists and throws if it is used.
- Logs go to stdout through pino. No log platform is configured.
- Video does not open a third-party room. `POST /api/appointments/:id/video-token` returns a short-lived HMAC token after a verified virtual payment, inside the join window. The browser still uses `getUserMedia`.

Paystack and SMTP are used only when their environment variables are set to live values. A Paystack key that contains `dummy` is treated as unset, and payment initialize returns 503. Without SMTP, password reset still returns 202 and demo email reports `delivered: false`.

## Response shape

Success: `{ "data": ... }`. Failure: `{ "error": { "code": "", "message": "" } }`. Times are ISO-8601. Amounts are naira. The hospital zone is Africa/Lagos.
