"use client";

import { AuthProvider } from '@/contexts/AuthContext'
import { SupabaseAuthProvider } from "@/contexts/SupabaseAuthContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SupabaseAuthProvider>
      <AuthProvider>{children}</AuthProvider>
    </SupabaseAuthProvider>
  );
}
