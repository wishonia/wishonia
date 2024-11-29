import { redirect } from "next/navigation"

import { getSafeRedirectUrl } from "@/app/dfda/dfdaActions"
import { getCurrentUser } from "@/lib/session"
import { LoginPromptButton } from "@/components/LoginPromptButton"

// Add Props interface for the page component
interface DfdaSafePageProps {
  params: {
    path: string
  }
}

export default async function DfdaSafePage({ params }: DfdaSafePageProps) {
  const session = await getCurrentUser()

  if (session) {
    const redirectUrl = await getSafeRedirectUrl(session.id, params.path)
    if (redirectUrl) {
      redirect(redirectUrl)
    }
  }

  // If not logged in or no token, show login prompt
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <LoginPromptButton
        buttonText="Sign in to access your Digital Twin Safe"
        buttonVariant="neobrutalist"
        buttonSize="lg"
      />
    </div>
  )
}
