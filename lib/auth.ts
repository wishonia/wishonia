import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import { getServerSession } from "next-auth/next"
import EmailProvider from "next-auth/providers/email"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import type { OAuthConfig } from "next-auth/providers/oauth"

import { env } from "@/env.mjs"
import { prisma as db } from "@/lib/db"

interface DFDAProfile {
  id: number | string
  displayName: string
  email: string
  avatar?: string

  [key: string]: any // Add index signature for UrlParams compatibility
}

const DFDAProvider = {
  id: "dfda",
  name: "The Decentralized FDA",
  type: "oauth",
  version: "2.0",
  authorization: {
    url: "https://safe.dfda.earth/oauth/authorize",
    params: {
      scope: "readmeasurements writemeasurements",
      grant_type: "authorization_code",
    },
  },
  token: {
    url: "https://safe.dfda.earth/oauth/token",
  },
  userinfo: "https://safe.dfda.earth/api/v1/user",
  profile(profile: DFDAProfile) {
    return {
      id: profile.id.toString(),
      name: profile.displayName,
      email: profile.email,
      image: profile.avatar,
    }
  },
  clientId: process.env.DFDA_CLIENT_ID,
  clientSecret: process.env.DFDA_CLIENT_SECRET,
} satisfies OAuthConfig<DFDAProfile>

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
    error: "/auth/error",
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
          scope: "read:org repo user read:user user:email",
        },
      },
    }),
    DFDAProvider,
  ],
  callbacks: {
    async session({ token, session }) {
      //console.log('Session callback - token:', token) // Debug log
      if (token) {
        session.user.id = token.id as string
        let { name } = token
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
      if (account?.provider) {
        // 1. Check if this provider account is already linked
        const existingProviderAccount = await db.account.findFirst({
          where: {
            provider: account.provider,
            providerAccountId: account.providerAccountId,
          },
          include: { user: true },
        })

        if (existingProviderAccount) {
          // Prevent linking same provider account to different users
          if (existingProviderAccount.user.email !== user.email) {
            return `/auth/error?error=AccountAlreadyLinked&provider=${account.provider}`
          }
          return true
        }

        // 2. Check for existing user with same email
        const existingUser = await db.user.findFirst({
          where: { email: user.email },
          include: { accounts: true },
        })

        if (existingUser) {
          // 3. If user exists, check if we're signed in
          const session = await getServerSession(authOptions)

          // If not signed in, prompt to sign in first
          if (!session) {
            return `/auth/error?error=SignInRequired&email=${user.email}`
          }

          // For dFDA, allow email mismatch but log it
          if (
            account.provider === "dfda" &&
            session.user.id !== existingUser.id
          ) {
            console.log("dFDA email mismatch:", {
              sessionEmail: session.user.email,
              dfdaEmail: user.email,
              userId: session.user.id,
            })
            // Continue with the connection despite email mismatch
          } else if (session.user.id !== existingUser.id) {
            // For other providers, maintain strict email matching
            return `/auth/error?error=EmailMismatch`
          }

          // Link the account
          await db.account.create({
            data: {
              userId: session.user.id, // Use session user ID instead of existingUser.id
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
      }
      return true
    },
  },
}


