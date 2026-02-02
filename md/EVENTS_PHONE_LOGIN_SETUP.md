# Events page: phone OTP login and profile modal

## What’s implemented

- **Profile button** (top-right on `/events`): opens a modal.
- **Not logged in**: modal shows only a **Log in** button → opens phone OTP flow.
- **Logged in**: modal shows **user name**, **Log out**, and **Ticket history**. Clicking a ticket shows its **QR code** and **status** (Confirmed).
- **Login**: phone number → send OTP (SMS) → enter OTP → verify → logged in. **Only** the main app **users** table is used; no `events_website_users` table.

## Main app users table

Events auth uses the main app **users** table:

- After OTP verify, the client sends `auth_user_id` (Supabase Auth user id) and `phone` to `/api/events-auth`.
- The API looks up **users** by `auth_user_id`, then by `phone_number` (normalized digits). If found, it returns that user’s `id`, `name` (from `first_name` + `last_name`), and `email`.
- If no user exists, a new row is created in **users** with `auth_user_id`, `phone_number`, `first_name` (optional), and `verified_phone: true`.

The code expects a table named **users** with columns: `id`, `auth_user_id`, `phone_number`, `first_name`, `last_name`, `email`, `verified_phone`.

**Creating new users (RLS):** If the **users** table has Row Level Security, the API uses **SUPABASE_SERVICE_ROLE_KEY** (server-side only) to insert new rows so RLS is bypassed. Add to `.env.local`: `SUPABASE_SERVICE_ROLE_KEY=your_service_role_key` (Supabase Dashboard → Settings → API → `service_role` secret). Never expose this key to the client.

## Setup

### 1. Enable Phone auth in Supabase

1. In **Supabase Dashboard**: **Authentication → Providers**.
2. Enable **Phone**.
3. Configure an **SMS provider** (e.g. Twilio) as in [Supabase Phone Login](https://supabase.com/docs/guides/auth/phone-login).

Without this, `signInWithOtp({ phone })` will not send real SMS (you may see a “Invalid phone number” or provider error).

### 2. Optional: keep email flow

The events-auth API still supports **email** (no OTP). The profile modal uses **phone + OTP** only; the “Enter your email” step (e.g. before payment) still uses email and does not use OTP.

## Files touched

- `app/events/page.tsx` – profile button, modal state, hydrate from `localStorage`, login/logout handlers.
- `components/EventsProfileModal.tsx` – modal: login / profile (name, logout, ticket history, ticket QR + status).
- `components/PhoneOTPForm.tsx` – phone → send OTP → verify OTP (Supabase Auth).
- `app/api/events-auth/route.ts` – look up **users** only by `auth_user_id` or `phone_number` (or email).
- `app/api/get-events-tickets/route.ts` – look up **users** only by `user_id` or email, then fetch tickets.
