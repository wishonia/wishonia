import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"

import { getUserWishingWell } from "@/lib/api/wishingWells"
import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"
import { WishingWellEditForm } from "@/components/wishingWell/wishing-well-edit-form"
import { Shell } from "@/components/layout/shell"
import { DashboardHeader } from "@/components/pages/dashboard/dashboard-header"
import {WishingWell} from "@prisma/client";

export const metadata: Metadata = {
    title: "Wishing Well Settings",
}

interface WishingWellEditProps {
    params: { wishingWellId?: string }
}

export default async function WishingWellEdit({ params }: WishingWellEditProps) {
    const user = await getCurrentUser()

    if (!user) {
        redirect(authOptions?.pages?.signIn || "/signin")
    }

    let wishingWell: WishingWell | null = null

    if (params.wishingWellId) {
        wishingWell = await getUserWishingWell(params.wishingWellId, user.id)
    } else {
        wishingWell = {
            id: "",
            name: "",
            description: "",
            userId: user.id,
            content: null, // Assuming content can be null
            images: [], // Assuming images is an array and can be empty
            featuredImage: null, // Assuming featuredImage can be null
            createdAt: new Date(), // Provide current date as default
            updatedAt: new Date(), // Provide current date as default
            averageAllocation: null // Assuming averageAllocation can be null
        }
    }

    if (!wishingWell) {
        notFound()
    }

    return (
        <Shell>
            <DashboardHeader
                heading="Wishing Well Settings"
                text="Enter the name and a detailed description of your wish."
            />
            <div className="grid grid-cols-1 gap-10">
                <WishingWellEditForm
                    wishingWell={{
                        id: wishingWell.id,
                        name: wishingWell.name,
                        description: wishingWell.description,
                    }}
                />
            </div>
        </Shell>
    )
}
