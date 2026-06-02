import { type NextRequest, NextResponse } from "next/server";
import type { CookieOptions } from "@supabase/ssr";
import { createServerClient } from "@supabase/ssr";

const protectedPrefixes = [
  "/dashboard",
  "/departments",
  "/users",
  "/respondents",
  "/questionnaires",
  "/questions",
  "/assignments",
  "/submissions",
  "/files",
  "/exports",
  "/audit-logs",
  "/settings",
  "/my-questionnaires",
  "/follow-ups",
  "/profile"
];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  const isProtected = protectedPrefixes.some((prefix) =>
    request.nextUrl.pathname.startsWith(prefix)
  );

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        }
      }
    }
  );

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (user && request.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"]
};
