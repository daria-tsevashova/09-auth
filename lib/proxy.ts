import { NextResponse } from "next/server";

const PRIVATE_PREFIXES = ["/profile", "/notes"];
const AUTH_PREFIXES = ["/sign-in", "/sign-up", "/auth"];

export function proxy(request: Request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  const cookie = request.headers.get("cookie") ?? "";
  
  const isAuth = Boolean(cookie && cookie.length > 0);

  const isPrivate = PRIVATE_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuthRoute = AUTH_PREFIXES.some((p) => pathname.startsWith(p));

  if (isPrivate && !isAuth) {
    return NextResponse.redirect(new URL("/sign-in", url));
  }

  if (isAuthRoute && isAuth) {
    return NextResponse.redirect(new URL("/profile", url));
  }

  return null;
}