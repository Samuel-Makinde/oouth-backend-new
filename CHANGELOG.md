# Changelog

## 0.1.1

- The consultation medicine catalogue lists each generic name, strength, and dosage form as its own product. A prescription dose is entered for the patient and is not copied from the product strength.
- Corporate investigation prices are stored on the laboratory catalog. A missing test or medicine is created at startup so the consultation catalog can show it.
- A patient can rate a consultation after the call ends, including before the note is signed. Skipping the rating does not save one.
- Desk officers 2 and 3 collect pharmacy, laboratory, and scan work for physical visits only.
- A verified virtual visit can start an audio or video call before its scheduled time. The call screen shows the server’s reason when the call service rejects the attempt.
- While Paystack is not configured, Pay with Paystack records the visit payment as verified and the booking screens show a payment-successful popup.
- Production startup applies Prisma migrations and, on an empty database, loads departments, fees, and preview staff so patient registration has a `User` table.
- Registration and login behind Render no longer fail when `X-Forwarded-For` is present. Express trusts one proxy hop, and session cookies use SameSite=None; Secure for a frontend on another site.
- Added consultation audio and video calls. Socket.IO signals the patient and assigned consultant. WebRTC carries the media. `GET /api/calls/ice-config` returns STUN and optional TURN servers from the environment.
- Startup now connects Prisma with `DATABASE_URL` only and logs the host, port, and database name. `PGHOST`, `PGUSER`, `PGPORT`, and `PGDATABASE` remain for `npm run db:azure`.
- Pointed local setup at Azure Database for PostgreSQL through `npm run db:azure`, which builds `DATABASE_URL` from a Microsoft Entra access token.
- Generated the access, refresh, and video HMAC secrets in `.env`. Dummy Paystack keys stay unset for live charges.

## 0.1.0

- Added the Express, TypeScript, Prisma, and PostgreSQL API for the OOUTH frontend contract.
- Added authentication with Argon2id, a short access JWT, and rotating refresh cookies.
- Added booking, Paystack verification, consultation signing, desk, nursing, pharmacy, diagnostics, and ratings.
- Added the workspace snapshot, presence flags, and the administrator routes the screens call.
- Left Redis, SMS, Azure Blob, and a log platform unwired behind interfaces.
- Connected the frontend cache to the API, with IndexedDB draft recovery and a Paystack redirect.
- Documented every route in `docs/API.md`.
