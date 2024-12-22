import { getServerSession } from "next-auth/next"

import { getUserIdServer } from "@/lib/api/getUserIdServer"
import { authOptions } from "@/lib/auth"

import { PredictorSearchResults } from "./components/PredictorSearchResults"
import { SearchForm } from "./components/SearchForm"

export const dynamic = 'force-dynamic'

export default async function PredictorSearchPage() {
  const session = await getServerSession(authOptions)
  const userId = await getUserIdServer()

  console.log("Server: Rendering PredictorSearchPage")
  console.log("Server: Session exists:", !!session)
  console.log("Server: UserId exists:", !!userId)

  return (
    <div className="mx-auto max-w-4xl">
      <SearchForm />
      <PredictorSearchResults session={session} userId={userId} />
    </div>
  )
}
