import { NextRequest, NextResponse } from "next/server";

const PRIVATE_PREFIXES = ["/profile", "/notes"];
const AUTH_PREFIXES = ["/sign-in", "/sign-up"];

export function proxy(request: NextRequest) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  const cookie = request.headers.get("cookie") ?? "";

  // Перевіряємо наявність accessToken в cookies
  const hasAccessToken = cookie.includes("accessToken=");

  const isPrivate = PRIVATE_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuthRoute = AUTH_PREFIXES.some((p) => pathname.startsWith(p));

  // Якщо намагаємося потрапити на приватну сторінку без токена
  if (isPrivate && !hasAccessToken) {
    return NextResponse.redirect(new URL("/sign-in", url));
  }

  // Якщо авторизовані і йдемо на auth сторінки - редірект на профіль
  if (isAuthRoute && hasAccessToken) {
    return NextResponse.redirect(new URL("/profile", url));
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
