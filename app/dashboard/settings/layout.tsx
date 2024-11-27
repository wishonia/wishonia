import { Toaster } from "@/components/ui/toaster"
import { Shell } from "@/components/layout/shell"

import { SidebarNav } from "./components/sidebar-nav"

const sidebarNavItems = [
  {
    title: "General",
    href: "/dashboard/settings",
  },
  {
    title: "Connections",
    href: "/dashboard/settings/connections",
  },
  {
    title: "Notifications",
    href: "/dashboard/settings/notifications",
  },
  {
    title: "Profile",
    href: "/dashboard/settings/profile",
  },
]

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <>
      <Shell>
        <div className="space-y-6 pb-16">
          <div className="space-y-0.5">
            <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
            <p className="text-muted-foreground">
              Manage your account settings and preferences.
            </p>
          </div>
          <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
            <aside className="lg:w-1/5">
              <SidebarNav items={sidebarNavItems} />
            </aside>
            <div className="flex-1">{children}</div>
          </div>
        </div>
      </Shell>
      <Toaster />
    </>
  )
}
