import { createServerSupabase } from "@/lib/supabase/server";

const DEFAULT_NEXT = "/repos";

// Only same-site paths. Resolve first, so tricks the URL parser strips ("/\t/evil.com") can't escape.
function safeNext(next: string | null, origin: string): string {
  if (!next?.startsWith("/")) return DEFAULT_NEXT;
  const url = new URL(next, origin);
  return url.origin === origin ? url.pathname + url.search + url.hash : DEFAULT_NEXT;
}

const redirect = (path: string, base: string) =>
  new Response(null, { status: 303, headers: { location: new URL(path, base).toString() } });

export async function handleAuthCallback(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (!code) return redirect("/?auth_error=1", url.origin);

  try {
    const supabase = await createServerSupabase();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) return redirect("/?auth_error=1", url.origin);
  } catch {
    return redirect("/?auth_error=1", url.origin);
  }

  return redirect(safeNext(url.searchParams.get("next"), url.origin), url.origin);
}
