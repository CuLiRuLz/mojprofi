import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BETA_PASSWORD = "stendal";
const COOKIE_NAME = "mojprofi_beta_access";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const { pathname } = request.nextUrl;

  const isBetaDomain = hostname.startsWith("beta.mojprofi.com");

  if (!isBetaDomain) {
    return NextResponse.next();
  }

  if (
    pathname.startsWith("/beta-login") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  const hasAccess = request.cookies.get(COOKIE_NAME)?.value === BETA_PASSWORD;

  if (!hasAccess) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/beta-login";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api).*)"],
};