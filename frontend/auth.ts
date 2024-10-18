import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import type { User } from 'next-auth';

// Extend the User type to include accessToken
interface ExtendedUser extends User {
  accessToken?: string;
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials): Promise<ExtendedUser | null> {
        // Here you would typically make a request to your backend
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        });

        if (!response.ok) {
          return null;
        }

        const user: ExtendedUser = await response.json();
        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as ExtendedUser).accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && typeof token.accessToken === 'string') {
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
});