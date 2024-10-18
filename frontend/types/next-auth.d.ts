import NextAuth, { DefaultSession, DefaultUser } from "next-auth"
import { JWT as DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      email: string
      accessToken: string
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    token: string
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    accessToken: string
    email: string
  }
}