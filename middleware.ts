import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Define paths that don't require authentication
const publicPaths = [
  "/",
  "/sign-in",
  "/sign-up",
  "/about",
  "/terms",
  "/privacy",
  "/contact",
  "/forgot-password",
  "/reset-password",
  "/api/auth",
];

// Helper to check if path is public
const isPublic = (path: string) => {
  return publicPaths.some((publicPath) => 
    path === publicPath || 
    path.startsWith(publicPath + "/") ||
    path.startsWith("/api/auth/") ||
    path.startsWith("/_next/") ||
    path.includes(".")
  );
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Security headers for all responses
  const securityHeaders = new Headers(request.headers);
  securityHeaders.set("X-Content-Type-Options", "nosniff");
  securityHeaders.set("X-Frame-Options", "DENY");
  securityHeaders.set("X-XSS-Protection", "1; mode=block");
  securityHeaders.set("Referrer-Policy", "strict-origin-when-cross-origin");
  securityHeaders.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  // Get token if exists
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Access to protected routes - redirect to login if not authenticated
  if (!isPublic(pathname) && !token) {
    const redirectUrl = new URL("/sign-in", request.url);
    redirectUrl.searchParams.set("callbackUrl", encodeURI(request.url));
    return NextResponse.redirect(redirectUrl);
  }

  // Prevent authenticated users from accessing login/register pages
  if (token && (pathname === "/sign-in" || pathname === "/sign-up")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Continue with security headers
  return NextResponse.next({
    request: {
      headers: securityHeaders,
    },
  });
}

// Configure paths this middleware will run for
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /_next/ (Next.js internals)
     * 2. /favicon.ico, /sitemap.xml, /robots.txt (static files)
     * 3. /api/auth (NextAuth.js API routes that don't need protection)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
}; 