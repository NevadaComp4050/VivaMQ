import { NextResponse, type NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export default function middleware(req: NextRequest) {

  const token = req.cookies.get("jwt")?.value;
  const isOnRegister = req.nextUrl.pathname.startsWith("/register");
  const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard");
  const isOnLoginPage = req.nextUrl.pathname.startsWith("/login");

  let isTokenExpired = false;
  
  if (token) {
    try {

      const decodedToken = jwt.decode(token) as jwt.JwtPayload;

      if (decodedToken?.exp && Date.now() >= decodedToken.exp * 1000) {
        isTokenExpired = true;
      } 
    } catch (error) {
      isTokenExpired = true;
    }
  }

  if (isOnDashboard && (!token || isTokenExpired)) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  if (isOnLoginPage && token && !isTokenExpired) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (isOnRegister && token && !isTokenExpired) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}
