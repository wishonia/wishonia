import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"

import EmailProvider from "next-auth/providers/email";

import { env } from "@/env.mjs"
import { prisma as db } from "@/lib/db"
import {User} from "@/types/models/User";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },
  providers: [
    EmailProvider({
      server: env.EMAIL_SERVER, // Configure your email server credentials
      from: env.EMAIL_FROM, // The email address to send magic link emails from
      // You can add more EmailProvider options here
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'read:org repo user read:user user:email',
        },
      },
    }),
      // dFDA custom oauth provider
    {
      id: 'dfda',
      name: 'The Decentralized FDA',
      type: 'oauth',
      version: '2.0',
      authorization: {
        url: 'https://safe.dfda.earth/oauth/authorize',
        params: {
          scope: 'readmeasurements writemeasurements',
          grant_type: 'authorization_code',
        },
      },
      accessTokenUrl: 'https://safe.dfda.earth/oauth/token',
      profileUrl: 'https://safe.dfda.earth/api/v1/user',
      profile: (profile: User) => ({
        id: profile.id.toString(),
        name: profile.displayName,
        email: profile.email,
        image: profile.avatar,
      }),
      clientId: process.env.DFDA_CLIENT_ID,
      clientSecret: process.env.DFDA_CLIENT_SECRET,
    }
  ],
  callbacks: {
    async session({ token, session }) {
      //console.log('Session callback - token:', token) // Debug log
      if (token) {
        session.user.id = token.id as string
        let {name} = token
        if (token.firstName && token.lastName) {
          name = `${token.firstName} ${token.lastName}`
        }
        session.user.name = name
        session.user.email = token.email as string | null | undefined
        session.user.image = token.picture as string | null | undefined
        // Use type assertion to bypass the type error
        ;(session.user as any).username = token.username as
          | string
          | null
          | undefined
        session.user.admin = token.admin as boolean | undefined
      }
      //console.log('Session callback - modified session:', session) // Debug log
      return session
    },
    async jwt({ token, user }) {
      if (token.id) {
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
        admin: dbUser.admin,
      }
    },
    // I think we might need this to add additional GitHub scopes
    // for getting files from GitHub repos
    async signIn({ user, account, profile, email, credentials }) {
      // Allow linking multiple providers to one account
      if (account?.provider) {
        const existingUser = await db.user.findFirst({
          where: {
            email: user.email,
          },
          include: {
            accounts: true,
          },
        })

        if (existingUser) {
          // If we're adding a new provider, link it to the existing user
          if (!existingUser.accounts.some(acc => acc.provider === account.provider)) {
            await db.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                token_type: account.token_type,
                scope: account.scope,
                expires_at: account.expires_at,
                refresh_token: account.refresh_token,
                id_token: account.id_token,
                session_state: account.session_state,
              },
            })
          }
          return true
        }
      }
      return true
    },
  },
}
