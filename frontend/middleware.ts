import { NextResponse } from 'next/server'
import { auth } from './auth'

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  // List of public routes that don't require authentication
  const publicRoutes = ['/signin', '/register']

  // Check if the current route is in the public routes list
  const isPublicRoute = publicRoutes.some(route => nextUrl.pathname.startsWith(route))

  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // If the user is not logged in and trying to access a protected route, redirect to signin
  if (!isLoggedIn) {
    const signInUrl = new URL('/signin', nextUrl.origin)
    signInUrl.searchParams.set('callbackUrl', nextUrl.href)
    return NextResponse.redirect(signInUrl)
  }

  // If the user is logged in and trying to access signin or register, redirect to home
  if (isLoggedIn && isPublicRoute) {
    return NextResponse.redirect(new URL('/', nextUrl.origin))
  }

  // For all other cases, allow the request to proceed
  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}