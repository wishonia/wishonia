import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"

import { CreatePetitionForm } from "../components/CreatePetitionForm"

export default async function CreatePetitionPage() {
  const session = await getServerSession()
  if (!session?.user) {
    redirect('/api/auth/signin')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create a Petition</h1>
      <CreatePetitionForm />
    </div>
  )
} 