import { NextResponse, NextRequest } from "next/server";
export function middleware(req: NextRequest) {
  const isAdmin = req.nextUrl.pathname.startsWith("/admin") && !req.nextUrl.pathname.startsWith("/admin/login");
  if (!isAdmin) return;
  const jwt = req.cookies.get(process.env.JWT_COOKIE_NAME || "shopbot_jwt")?.value;
  if (!jwt) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }
}
export const config = { matcher: "/admin/:path*" };
