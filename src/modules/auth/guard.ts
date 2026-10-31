import { type NextRequest, NextResponse } from "next/server";

type Deps = { sample: boolean; getUser: () => Promise<{ id: string } | null> };

/** Dashboard pages need a signed-in user; local sample mode needs none. */
export async function guardDashboard(
  request: NextRequest,
  { sample, getUser }: Deps,
): Promise<NextResponse> {
  if (sample || (await getUser())) return NextResponse.next({ request });
  return NextResponse.redirect(new URL("/?signin=required", request.url));
}
