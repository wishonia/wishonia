"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import * as React from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { updateWishingWell } from "@/app/actions/wishing-well"
import { Button } from "@/components/ui/button"
import { ImageUpload } from "@/components/ui/image-upload"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

const wishingWellSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  content: z.string().optional(),
  featuredImage: z.string().optional(),
  images: z.array(z.string()).optional(),
})

type FormData = z.infer<typeof wishingWellSchema>

interface WishingWellEditFormProps {
  wishingWell: {
    id: string
    name: string
    description: string | null
    content: string | null
    images: string[]
    featuredImage: string | null
  }
}

export function WishingWellEditForm({ wishingWell }: WishingWellEditFormProps) {
  const router = useRouter()
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(wishingWellSchema),
    defaultValues: {
      name: wishingWell.name,
      description: wishingWell.description || "",
      content: wishingWell.content || "",
      featuredImage: wishingWell.featuredImage || "",
      images: wishingWell.images,
    },
  })

  async function onSubmit(data: FormData) {
    try {
      await updateWishingWell({
        id: wishingWell.id,
        ...data,
      })

      toast({
        description: "Your WishingWell has been updated.",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Something went wrong.",
        description: error instanceof Error ? error.message : "Your WishingWell was not updated. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="space-y-2">
        <Input
          {...register("name")}
          placeholder="Name your WishingWell"
          className="text-lg font-bold"
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Textarea
          {...register("description")}
          placeholder="Describe your WishingWell (optional)"
          className="min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Textarea
          {...register("content")}
          placeholder="Add detailed content about your WishingWell (optional)"
          className="min-h-[200px]"
        />
      </div>

      <div className="space-y-4">
        <ImageUpload
          label="Featured Image"
          value={wishingWell.featuredImage || ""}
          onChange={(value: string | string[]) => {
            if (typeof value === "string") {
              setValue("featuredImage", value)
            }
          }}
        />

        <ImageUpload
          label="Additional Images"
          multiple
          value={wishingWell.images}
          onChange={(value: string | string[]) => {
            if (Array.isArray(value)) {
              setValue("images", value)
            }
          }}
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  )
} 