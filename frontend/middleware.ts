import { auth } from "~/auth"

// Helper function to handle CORS
const handleCORS = (req: Request) => {
  if (req.method === 'OPTIONS') {
    const headers = new Headers()
    headers.set('Access-Control-Allow-Origin', 'http://3.107.222.31')
    headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    headers.set('Access-Control-Allow-Credentials', 'true')
    return new Response(null, { headers })
  }

  return null
}

export default auth((req) => {
  // Handle CORS
  const corsResponse = handleCORS(req)
  if (corsResponse) return corsResponse

  // Existing authentication logic
  const isAuthPage = req.nextUrl.pathname.startsWith('/signin') || req.nextUrl.pathname.startsWith('/register')
  
  if (!req.auth && !isAuthPage) {
    const signInUrl = new URL('/signin', req.url)
    signInUrl.searchParams.set('callbackUrl', req.url)
    return Response.redirect(signInUrl)
  }

  if (req.auth && isAuthPage) {
    return Response.redirect(new URL('/dashboard', req.url))
  }
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
