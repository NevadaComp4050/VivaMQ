import { NextResponse, type NextRequest } from 'next/server';

export default function middleware(req: NextRequest) {
  const token = req.cookies.get("jwtToken");

  const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard");
  const isOnLoginPage = req.nextUrl.pathname.startsWith("/login");

  if (isOnDashboard && !token) {
    return NextResponse.redirect(new URL("/register", req.url));
  }

  if (isOnLoginPage && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}
