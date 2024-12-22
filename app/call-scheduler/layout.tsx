import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getServerSession } from "next-auth/next"
import { UserAccountNav } from "@/components/user/user-account-nav"
import { NavItem } from "@/types"

const avatarNavItems: NavItem[] = [
  {
    title: "Account",
    href: "/call-scheduler/account",
  },
]

export default async function PhoneFriendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/call-scheduler" className="flex items-center gap-2 text-lg font-semibold">
            <Heart className="h-6 w-6 text-primary" />
            <span>HeartLine</span>
          </Link>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            {session?.user ? (
              <>
                <Link href="/call-scheduler/schedules">
                  <Button variant="ghost">Schedules</Button>
                </Link>
                <UserAccountNav
                    user={{
                        name: session?.user.name,
                        image: session?.user.image,
                        email: session?.user.email,
                    }}
                    avatarNavItems={avatarNavItems}
                />
              </>
            ) : (
              <>
                <Link href="/call-scheduler#features">
                  <Button variant="ghost">Features</Button>
                </Link>
                <Link href="/call-scheduler#how-it-works">
                  <Button variant="ghost">How it works</Button>
                </Link>
                <Link href="/call-scheduler#faq">
                  <Button variant="ghost">FAQ</Button>
                </Link>
                <Link href="/call-scheduler/schedules">
                  <Button variant="default">Get Started</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main>
        {children}
      </main>
    </div>
  )
} 