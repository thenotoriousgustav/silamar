import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Optimized session check using full database validation (Node.js runtime)
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Protected routes check
  const isDashboardRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/resume-builder") ||
    pathname.startsWith("/resume-analysis") ||
    pathname.startsWith("/cover-letter") ||
    pathname.startsWith("/job-tracker") ||
    pathname.startsWith("/skill-gap") ||
    pathname.startsWith("/settings");

  if (isDashboardRoute && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If logged in and trying to access auth pages, redirect to dashboard
  const isAuthPage = pathname === "/login" || pathname === "/register";
  if (isAuthPage && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (svg, png, jpg, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
