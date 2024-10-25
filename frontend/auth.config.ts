import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnSignInPage = nextUrl.pathname.startsWith("/signin")
      const isOnRegisterPage = nextUrl.pathname.startsWith("/register")

      if (isOnSignInPage || isOnRegisterPage) {
        if (isLoggedIn) return Response.redirect(new URL("/dashboard/units", nextUrl))
        return true
      }

      if (!isLoggedIn) {
        return false
      }

      return true
    },
  },
  providers: [], // configured in auth.ts
} satisfies NextAuthConfig