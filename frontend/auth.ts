import NextAuth, { User } from "next-auth";
import { authConfig } from "./auth.config";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email as string;
        const password = credentials.password as string;

        let user = null;

        user = await getUser(email, password);

        if (!user) {
          throw new Error("User not found");
        }
        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 12, // 12 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.email = user.email as string;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        accessToken: token.accessToken as string,
        email: token.email as string,
      };
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
});

const getUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/user/login`,
      {
        email: email,
        password: password,
      }
    );

    if (response.data && response.data.token) {
      const user: User = {
        email: email,
        accessToken: response.data.token,
      };
      return user;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};
