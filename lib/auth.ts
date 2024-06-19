import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
//import EmailProvider from "next-auth/providers/email";

import { env } from "@/env.mjs"
import { prisma as db } from "@/lib/db"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },
  providers: [
    // EmailProvider({
    //   server: env.EMAIL_SERVER, // Configure your email server credentials
    //   from: env.EMAIL_FROM, // The email address to send magic link emails from
    //   // You can add more EmailProvider options here
    // }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id
        let name = token.name
        if(token.firstName && token.lastName) {
            name = `${token.firstName} ${token.lastName}`
        }
        session.user.name = name
        session.user.email = token.email as string | null | undefined;
        session.user.image = token.picture as string | null | undefined;
        // Use type assertion to bypass the type error
        (session.user as any).username = token.username as string | null | undefined;
        session.user.admin = token.admin as boolean | undefined;
      }

      return session
    },
    async jwt({ token, user }) {
      if(token.id){
        return token
      }
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      })

      if (!dbUser) {
        if (user) {
          token.id = user?.id
        }
        return token
      }

      return {
        id: dbUser.id,
        username: dbUser.username,
        email: dbUser.email,
        picture: dbUser.image,
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        createdAt: dbUser.createdAt,
        updatedAt: dbUser.updatedAt,
        web3Wallet: dbUser.web3Wallet,
        admin: dbUser.admin
      }
    },
  },
}
