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

/**
 * GitHub's token is only available right after sign-in. Hand it to the API once, server-side,
 * so it can see which GitHub App installations this user has. Sign-in still works if this fails;
 * the dashboard then asks the user to sign in again.
 */
async function linkGithub(
  session: { access_token: string; provider_token?: string | null } | null | undefined,
) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl || !session?.provider_token) return;
  try {
    await fetch(`${apiUrl}/me/github-link`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ githubToken: session.provider_token }),
    });
  } catch {
    // shortcut: no retry; the user is told to sign in again if their installations are missing
  }
}

export async function handleAuthCallback(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (!code) return redirect("/?auth_error=1", url.origin);

  let session: { access_token: string; provider_token?: string | null } | null | undefined;
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) return redirect("/?auth_error=1", url.origin);
    session = data?.session;
  } catch {
    return redirect("/?auth_error=1", url.origin);
  }

  await linkGithub(session);

  return redirect(safeNext(url.searchParams.get("next"), url.origin), url.origin);
}
