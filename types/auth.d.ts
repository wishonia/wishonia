import { User as NextAuthUser } from "next-auth"

type UserId = string

type NavUser = {
  user?: NextAuthUser & {
    id: UserId
    username?: string
    admin?: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: UserId
    verifiedEmail?: string | null
  }
}

declare module "next-auth" {
  interface Session {
    user: NextAuthUser & {
      id: UserId
      username: string
      admin?: boolean
      verifiedEmail?: string | null
    }
  }
}

export interface ExtendedUser extends NextAuthUser {
  admin?: boolean
  username?: string
}
