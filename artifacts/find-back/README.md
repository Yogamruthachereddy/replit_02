# FIND-BACK

**Verified information. Faster action. Bring them home.**

FindBack is a privacy-conscious missing-person reporting and case coordination MVP for families, community members, and authorized human reviewers. It is designed around one rule: verify information before amplifying it.

## What it includes

- Public-safe case search, filters, map, case details, and timelines
- Four-step missing-person report flow and sighting submission with safety guidance
- Authority review actions for reports and sightings, plus case status updates
- Admin overview, user/flag management surfaces, and case analytics
- Notifications, safety/privacy/terms pages, report-abuse flow, and responsive layouts
- Fictional demo records: 15 cases and 10 sightings
- Local demo workspace with browser persistence and simulated user roles
- Supabase Auth, PostgreSQL, Storage, and RLS integration path

## Data and security

The default **Demo workspace** uses fictional data stored in the current browser only. Demo role switching is for a presentation; it is not authentication or an authorization boundary. Do not enter real missing-person or reporter information in demo mode.

Supabase mode is designed for real accounts after the migration has been applied. The migration separates public-safe case data from reporter contact details, exact locations, and sighting evidence. Public coordinates are rounded; sensitive records and evidence are restricted with RLS and private Storage buckets. Human reviewers make every verification, sighting, and resolution decision.

The browser uses only the Supabase project URL and publishable key. Never add a Supabase service-role key, database password, or other privileged credential to the frontend.

## Supabase setup

1. Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` for the app. `.env.example` shows the project values supplied for this build.
2. In the Supabase SQL Editor, run `supabase/migrations/202610060001_findback.sql`.
3. Optionally run `supabase/seed.sql` to add fictional case and sighting records.
4. Create accounts through Supabase Auth. New accounts receive the `user` role.
5. Assign reviewer/admin roles only through a trusted Supabase administrative session. To bootstrap the first administrator, verify the account in Auth, then run an owner-approved SQL update in the SQL Editor, for example:

   ```sql
   update public.profiles set role = 'admin'
   where email = 'the-verified-admin-account@example.com';
   ```

6. Sign in to the app and select the cloud workspace. Authenticated actions use the database RLS policies and reviewer RPC functions.

No demo passwords or pre-created privileged accounts are included. Never promote an account based on client-side form input.

## Run locally

```sh
pnpm install
pnpm --filter @workspace/find-back run dev
```

The Replit web workflow supplies the required port and base path. For local development, configure the two Vite variables above in a local environment file. Use `pnpm --filter @workspace/find-back run typecheck` to typecheck this app.

## Architecture

- React, TypeScript, Vite, Wouter, Tailwind CSS, and reusable accessible UI components
- Supabase JS client for authentication, database access, and private Storage uploads
- Supabase PostgreSQL migration with RLS, reviewer RPCs, and audit records
- Leaflet and OpenStreetMap for approximate public case locations
- Recharts for dashboard analytics
- Browser localStorage for fictional demo workspace state only

## Limitations and next steps

- Applying the migration and creating/assigning real Supabase accounts must be done by an authorized project owner in Supabase.
- Supabase Auth confirmation and password-reset email delivery depend on the project’s Auth email settings.
- The local demo is intentionally isolated to the current browser and is not shared or suitable for production data.
- Production launch should include a privacy/legal review, abuse-rate controls, retention policy, verified contact channels, and operational procedures with relevant authorities. FindBack is not a replacement for emergency services or law enforcement.
