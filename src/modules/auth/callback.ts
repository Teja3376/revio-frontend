import { createServerSupabase } from "@/lib/supabase/server";

const DEFAULT_NEXT = "/repos";

// Only same-site paths: "/x" yes; "//x", "/\x", "https://x" or "x" no (open redirect).
function safeNext(next: string | null): string {
  return next && /^\/(?![/\\])/.test(next) ? next : DEFAULT_NEXT;
}

const redirect = (path: string, base: string) =>
  new Response(null, { status: 303, headers: { location: new URL(path, base).toString() } });

export async function handleAuthCallback(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (!code) return redirect("/?auth_error=1", url.origin);

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return redirect("/?auth_error=1", url.origin);

  return redirect(safeNext(url.searchParams.get("next")), url.origin);
}
