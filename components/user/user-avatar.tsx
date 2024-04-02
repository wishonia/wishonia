import { User } from "@prisma/client"
import { AvatarProps } from "@radix-ui/react-avatar"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Icons } from "@/components/icons"

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, "imageUrl" | "name">
}

export function UserAvatar({ user, ...props }: UserAvatarProps) {
  return (
    <div className="flex items-center">
      <Avatar {...props}>
        {user.imageUrl ? (
          <AvatarImage alt="Picture" src={user.imageUrl} />
        ) : (
          <AvatarFallback>
            <span className="sr-only">{user.name}</span>
            <Icons.userAlt className="h-4 w-4" />
          </AvatarFallback>
        )}
      </Avatar>
    </div>
  )
}
