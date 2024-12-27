import { useState } from "react"
import { useRouter } from "next/navigation"
import { User } from "@prisma/client"
import { AvatarProps } from "@radix-ui/react-avatar"
import axios from "axios" // Assuming you're using axios for HTTP requests

import { Avatar, AvatarImage } from "@/components/ui/avatar"

interface UserAvatarFormProps extends AvatarProps {
  user: Pick<User, "image" | "name">
  onUpdate: (newImageUrl: string) => void // Callback to update parent component state
}

export function UserAvatarForm({
  user,
  className,
  onUpdate,
  ...props
}: UserAvatarFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(user.image)

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]

      // Assuming you have an endpoint to handle image upload
      const formData = new FormData()
      formData.append("image", file)

      try {
        setLoading(true)
        const response = await axios.post("/api/upload-avatar", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        const newImageUrl = response.data.imageUrl
        onUpdate(newImageUrl) // Update parent component or global state with new image URL
        setSelectedImage(newImageUrl)
      } catch (error) {
        console.error("Failed to upload image", error)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="flex items-center">
      <Avatar {...props}>
        <AvatarImage alt="User avatar" src={selectedImage || ""} />
      </Avatar>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        disabled={loading}
        className="ml-4"
      />
      {loading && <p>Uploading...</p>}
    </div>
  )
}
