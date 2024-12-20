import { requireAuth } from "@/lib/auth"
import { PersonSetupForm } from "../../components/PersonSetupForm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function NewRecipientPage() {
  await requireAuth('/phone-friend')

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Add New Recipient</h1>
      <div className="max-w-md mx-auto">
        <PersonSetupForm isLoggedIn={true} />
      </div>
    </div>
  )
} 