import React from "react"

import { WishForm } from "@/components/wishingWell/wish-form"

export default async function WishingWellEdit() {
  return (
    <div className="min-h-screen bg-white p-4">
      <div className="mx-auto flex min-h-screen max-w-xl flex-col justify-center">
        <WishForm />
      </div>
    </div>
  )
}
