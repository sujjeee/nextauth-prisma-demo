import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt"

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt'
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials) {
        const { email, password, getLoginToken } = credentials as {
          email: string
        } & (
            | { password: string; getLoginToken?: never }
            | { password?: never; getLoginToken: string }
          );
        const isUser = await prisma.user.findFirst({
          where: {
            OR: [
              { email: email },
              { signatureToken: getLoginToken }
            ]
          }
        })

        if (!isUser) {
          throw new Error('No user found with the email');
        }

        if (password && !getLoginToken) {
          const checkPassword = await bcrypt.compare(password, isUser?.password ?? "");
          if (checkPassword) {
            return isUser;
          }
        } else if (!password && getLoginToken) {
          if (isUser.signatureToken === getLoginToken) {
            return isUser;
          }
        }
        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user }) {
      const existingUser = await prisma.user.findUnique({
        where: {
          email: user.email ?? ""
        }
      });
      if (existingUser) {
        return true
      } else {
        return false
      }
    }
  },
  secret: process.env.JWT_SESSION_SECRET as string,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }