import { getServerSession } from "next-auth/next"

import { getUserIdServer } from "@/lib/api/getUserIdServer"
import { authOptions } from "@/lib/auth"

import { PredictorSearchResults } from "./components/PredictorSearchResults"
import { SearchForm } from "./components/SearchForm"

export default async function PredictorSearchPage() {
  const session = await getServerSession(authOptions)
  const userId = await getUserIdServer()

  return (
    <div className="mx-auto max-w-4xl">
      <SearchForm />
      <PredictorSearchResults session={session} userId={userId} />
    </div>
  )
}
