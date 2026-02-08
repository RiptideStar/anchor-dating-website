# Complete Supabase Auth Implementation

## Overview

This implementation provides **persistent, cookie-based authentication** for the events website, matching the mobile app's auth flow. Users stay logged in across page refreshes and browser sessions until they explicitly log out.

## Architecture

### 1. **Client-side Auth** (`lib/supabase/client.ts`)
- Uses `@supabase/ssr` with `createBrowserClient`
- Handles browser-side auth operations (login, logout, session management)
- Automatically syncs with cookies for persistence

### 2. **Server-side Auth** (`lib/supabase/server.ts`)
- Uses `@supabase/ssr` with `createServerClient`
- Reads session from cookies in Server Components and API routes
- Allows server-side user validation without exposing credentials

### 3. **Middleware** (`middleware.ts`)
- Automatically refreshes sessions on every request
- Keeps user logged in by updating auth cookies
- Can protect routes (optional - see below)

### 4. **Auth Context** (`contexts/SupabaseAuthContext.tsx`)
- Provides global auth state via React Context
- Hooks: `useSupabaseAuth()` returns `{ user, loading, signOut }`
- Listens to auth state changes and updates UI automatically

## Key Files

```
lib/
├── supabase/
│   ├── client.ts          # Browser client (use in Client Components)
│   ├── server.ts          # Server client (use in Server Components/API routes)
│   └── middleware.ts      # Session refresh logic
├── middleware.ts          # Next.js middleware (session refresh on every request)
└── contexts/
    └── SupabaseAuthContext.tsx  # React Context for auth state

components/
├── Providers.tsx          # Wraps app with SupabaseAuthProvider
├── PhoneOTPForm.tsx       # Phone OTP login component
└── EventsProfileModal.tsx # Profile modal with logout
```

## How It Works

### Login Flow (Phone OTP)

1. **User enters phone** → `PhoneOTPForm` calls `supabase.auth.signInWithOtp({ phone })`
2. **User enters OTP** → `PhoneOTPForm` calls `supabase.auth.verifyOtp({ phone, token, type: "sms" })`
3. **On success**:
   - Supabase creates session and stores it in cookies (via `@supabase/ssr`)
   - `access_token` is sent to `/api/events-auth` to create/fetch user profile
   - `SupabaseAuthContext` detects auth change and updates `user` state
   - User is redirected/modal closes

### Session Persistence

**Why login persists:**
- Supabase stores session in **HTTP-only cookies** (secure, not accessible via JS)
- Middleware (`middleware.ts`) runs on **every request** and:
  - Reads session from cookies
  - Refreshes tokens if needed
  - Updates cookies with fresh session
- Result: User stays logged in across:
  - Page refreshes
  - Browser restarts
  - Tab closes/reopens

### Logout Flow

1. User clicks "Log out" → calls `supabaseSignOut()` from context
2. Context calls `supabase.auth.signOut()`
3. Supabase clears all session cookies
4. `onAuthStateChange` listener fires → `user` becomes `null`
5. UI updates to show logged-out state

## Usage Examples

### In Client Components

```tsx
'use client'

import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext'
import { createClient } from '@/lib/supabase/client'

export default function MyComponent() {
  const { user, loading, signOut } = useSupabaseAuth()
  const supabase = createClient()

  if (loading) return <div>Loading...</div>
  if (!user) return <div>Please log in</div>

  return (
    <div>
      <p>Welcome {user.phone}</p>
      <button onClick={signOut}>Logout</button>
    </div>
  )
}
```

### In Server Components

```tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ProtectedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return <h1>Welcome {user.phone}</h1>
}
```

### In API Routes

```tsx
import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Fetch user-specific data
  return NextResponse.json({ data: '...' })
}
```

## Events Page Integration

The `/events` page currently uses `localStorage` for auth state. With this Supabase implementation:

**Before:**
```tsx
// Hydrate from localStorage
useEffect(() => {
  const storedUserId = localStorage.getItem("anchor_events_websiteUserId")
  // ...
}, [])
```

**After (optional migration):**
```tsx
'use client'

import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext'

export default function EventsPage() {
  const { user, loading } = useSupabaseAuth()
  
  // user.phone, user.id are automatically available
  // No localStorage needed - session is in cookies
}
```

**Note:** The current `localStorage` approach on `/events` still works. You can migrate gradually or keep both systems (Supabase for auth, localStorage for events-specific state).

## Protected Routes (Optional)

To protect routes like `/dashboard` or `/admin`:

**Update `middleware.ts`:**

```ts
export async function middleware(req: NextRequest) {
  const res = await updateSession(req)
  
  const supabase = createMiddlewareClient(...)
  const { data: { user } } = await supabase.auth.getUser()

  // Protect /dashboard routes
  if (!user && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return res
}
```

## Security Checklist

✅ **Session stored in HTTP-only cookies** (not localStorage)  
✅ **Service role key never exposed to client** (only used in API routes if needed)  
✅ **Middleware refreshes tokens automatically**  
✅ **RLS policies enforce data access** (`auth.uid() = auth_user_id`)  
✅ **Access token sent to API for user creation** (no service role key needed for phone OTP flow)

## Troubleshooting

### Users get logged out randomly
- Check that `middleware.ts` is running (matcher should include your routes)
- Ensure `@supabase/ssr` is installed (`bun add @supabase/ssr`)

### Session not persisting
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- Restart dev server after changing `.env.local`
- Check browser cookies: look for `sb-*` cookies

### "User not found" after OTP
- Ensure `/api/events-auth` receives `access_token` from client
- Check that RLS policy allows: `auth.uid() = auth_user_id` for INSERT on `users` table
- Verify phone number is in E.164 format (+1234567890)

### Types errors with `createClient()`
- `client.ts`: returns `SupabaseClient` directly
- `server.ts`: must be awaited in Server Components (Next.js 15+)

## Next Steps

1. ✅ **Test login/logout** - verify cookies are set/cleared
2. ✅ **Test refresh** - reload page, user should stay logged in
3. **Migrate events page** (optional) - replace `localStorage` with `useSupabaseAuth()`
4. **Add protected routes** - update middleware if needed
5. **Production** - ensure RLS policies are correct on Supabase dashboard

## Mobile App Parity

This implementation matches the mobile app's auth flow:

| Feature | Mobile App | Website |
|---------|------------|---------|
| OTP Login | ✅ Phone OTP | ✅ Phone OTP |
| Session Storage | ✅ Secure storage | ✅ HTTP-only cookies |
| Auto-refresh | ✅ Yes | ✅ Middleware |
| User Creation | ✅ With user's session | ✅ With access_token |
| Logout | ✅ Clears session | ✅ Clears cookies |
| Persistence | ✅ Across app restarts | ✅ Across page reloads |
