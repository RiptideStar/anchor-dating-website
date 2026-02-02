-- Add phone column for phone+OTP login on events
-- Run in Supabase SQL Editor after create-events-website-users-table.sql

-- Make email optional (for phone-only users)
ALTER TABLE events_website_users
  ALTER COLUMN email DROP NOT NULL;

-- Add unique phone column
ALTER TABLE events_website_users
  ADD COLUMN IF NOT EXISTS phone TEXT UNIQUE;

CREATE UNIQUE INDEX IF NOT EXISTS idx_events_website_users_phone
  ON events_website_users(phone) WHERE phone IS NOT NULL;
