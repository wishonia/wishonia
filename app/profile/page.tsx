import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import ProfileForm from "./ProfileForm"
import prisma from "@/lib/prisma"

export default async function ProfilePage() {
    const session = await getServerSession()

    if (!session?.user?.email) {
        redirect("/login")
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    })

    if (!user) {
        return <div>User not found</div>
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
            <ProfileForm user={user} />
        </div>
    )
}