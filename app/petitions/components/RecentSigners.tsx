import { PetitionSignature, User } from "@prisma/client"

type SignatureWithUser = PetitionSignature & {
  user: {
    name: string | null
    image: string | null
  }
}

export function RecentSigners({ signatures }: { signatures: SignatureWithUser[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {signatures.map((sig) => (
        <div key={sig.id} className="flex items-center gap-2">
          {sig.user.image && (
            <img src={sig.user.image} alt="" className="w-6 h-6 rounded-full" />
          )}
          <span className="text-sm">{sig.user.name} signed</span>
        </div>
      ))}
    </div>
  )
} 