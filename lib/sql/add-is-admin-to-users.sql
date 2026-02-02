-- Add is_admin and auth_user_id columns to users table
-- Run this in Supabase SQL Editor

-- Add is_admin column if it doesn't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Add auth_user_id column if it doesn't exist (to link with Supabase Auth)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id);

-- Create index on auth_user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON users(auth_user_id);

-- Create index on is_admin for filtering
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON users(is_admin);

-- Optional: Set specific user as admin (replace with your email)
-- UPDATE users SET is_admin = true WHERE email = 'your-email@example.com';
