# Lab 6 — Sponsor Pipeline Tracker

This project was built for the staff interview with Katelin Cannon (GIX Director of Partnerships). It tracks sponsors, meetings, and project ideas in one place and enforces per-user data isolation so each authenticated user only sees their own records.

## Stack

- Next.js 15 (App Router, TypeScript)
- Tailwind CSS
- Supabase (Auth + Postgres + RLS)

## Setup

```bash
cd lab4
npm install
cp .env.example .env.local
# then fill NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local
```

## Database

Run `supabase/schema.sql` in the Supabase SQL Editor. This creates all three tables, enables RLS, and adds SELECT/INSERT/UPDATE/DELETE policies.

## Run

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## RLS Evidence

See `supabase/schema.sql` for the `CREATE POLICY` statements.

## Auth Note

Email confirmation is disabled in Supabase Dashboard for testing. Real deployment should re-enable it.

## Test Accounts

Referenced in the lab report only (not committed): `testa = tayali0701@gmail.com`, `testb = tayali0701+b@gmail.com`.

Real Supabase URL and anon key are submitted via the course submission form, not in the repo.
