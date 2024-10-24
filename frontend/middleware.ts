import { auth } from "~/auth"

export default auth((req) => {
  const isAuthPage = req.nextUrl.pathname.startsWith('/signin') || req.nextUrl.pathname.startsWith('/register')
  
  if (!req.auth && !isAuthPage) {
    const signInUrl = new URL('/signin', req.url)
    signInUrl.searchParams.set('callbackUrl', req.url)
    return Response.redirect(signInUrl)
  }

  if (req.auth && isAuthPage) {
    return Response.redirect(new URL('/dashboard/units', req.url))
  }
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}