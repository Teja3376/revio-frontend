import "server-only";
import { createClient } from "@supabase/supabase-js";

/** Server-only client with the secret key. Never import this from a client component. */
export function createAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.SUPABASE_SECRET_KEY ?? "",
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
