import { NextRequest, NextResponse } from "next/server";
import { checkSession } from "./lib/api/serverApi";

const PRIVATE_PREFIXES = ["/profile", "/notes"];
const AUTH_PREFIXES = ["/sign-in", "/sign-up"];

function getCookie(cookies: string, name: string): string | null {
  const value = `; ${cookies}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
}

export async function proxy(request: NextRequest) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  const cookieHeader = request.headers.get("cookie") ?? "";

  const accessToken = getCookie(cookieHeader, "accessToken");
  const refreshToken = getCookie(cookieHeader, "refreshToken");

  const isPrivate = PRIVATE_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuthRoute = AUTH_PREFIXES.some((p) => pathname.startsWith(p));

  let isAuthenticated = false;
  if (accessToken || refreshToken) {
    try {
      const user = await checkSession({ cookies: cookieHeader });
      isAuthenticated = !!user;
    } catch {
      isAuthenticated = false;
    }
  }

  if (isPrivate && !isAuthenticated) {
    return NextResponse.redirect(new URL("/sign-in", url));
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/", url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, images
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.svg|.*\\.ico).*)",
  ],
};
