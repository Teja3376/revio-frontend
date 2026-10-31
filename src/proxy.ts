import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { SAMPLE_MODE } from "@/lib/sample-mode";
import { guardDashboard } from "@/modules/auth/guard";

/** Keeps the Supabase session fresh and keeps signed-out visitors out of the dashboard. */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "",
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (list) => {
          for (const { name, value } of list) request.cookies.set(name, value);
          response = NextResponse.next({ request });
          for (const { name, value, options } of list) response.cookies.set(name, value, options);
        },
      },
    },
  );
  const result = await guardDashboard(request, {
    sample: SAMPLE_MODE,
    getUser: async () => (SAMPLE_MODE ? null : (await supabase.auth.getUser()).data.user),
  });
  return result.headers.get("location") ? result : response;
}

export const config = { matcher: ["/repos/:path*", "/reviews/:path*", "/settings/:path*"] };
