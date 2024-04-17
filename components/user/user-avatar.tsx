import { User } from "@prisma/client"
import { AvatarProps } from "@radix-ui/react-avatar"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Icons } from "@/components/icons"

interface UserAvatarProps extends AvatarProps {
    user: Pick<User, "image" | "name">
}

export function UserAvatar({ user, ...props }: UserAvatarProps) {
    return (
        <div id="avatar-container" className="flex items-center relative">
            <Avatar id="avatar component" {...props}>
                {/* Always render the fallback icon behind the image */}
                <AvatarFallback id="avatar-fallback-component" className="absolute inset-0 flex items-center justify-center">
                    <Icons.userAlt className="h-4 w-4" />
                </AvatarFallback>
                {user.image ? (
                    <AvatarImage id="avatar-image-component" alt="Picture" src={user.image} className="relative z-10" onError={(e) => e.currentTarget.style.display = 'none'} />
                ) : (
                    <span className="sr-only">{user.name}</span>
                )}
            </Avatar>
        </div>
    )
}
