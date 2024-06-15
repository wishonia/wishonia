import { User as NextAuthUser } from "next-auth"
import { JWT } from "next-auth/jwt"

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
  }
}

declare module "next-auth" {
  interface Session {
    user: NextAuthUser & {
      id: UserId
      username: string
      admin?: boolean
    }
  }
}

export interface ExtendedUser extends NextAuthUser {
  admin?: boolean;
  username?: string
}
