"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { ImageUpload } from "@/components/ui/image-upload"
import type { WishingWell } from "@prisma/client"

const wishingWellSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  content: z.string().optional(),
  images: z.array(z.string()).optional(),
  featuredImage: z.string().optional(),
})

type FormData = z.infer<typeof wishingWellSchema>

interface WishingWellFormProps {
  wishingWell: WishingWell
}

export function WishingWellForm({ wishingWell }: WishingWellFormProps) {
  const router = useRouter()
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(wishingWellSchema),
    defaultValues: {
      name: wishingWell.name,
      description: wishingWell.description || "",
      content: wishingWell.content || "",
      images: wishingWell.images,
      featuredImage: wishingWell.featuredImage || "",
    },
  })

  async function onSubmit(data: FormData) {
    try {
      const response = await fetch(`/api/wishing-wells/${wishingWell.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error("Failed to update wishing well")

      toast({
        description: "Your Wishing Well has been updated.",
      })

      router.refresh()
      router.push(`/dashboard/wishingWells/${wishingWell.id}`)
    } catch (error) {
      toast({
        title: "Something went wrong.",
        description: error instanceof Error ? error.message : "Failed to update wishing well",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <Input
            id="name"
            {...register("name")}
            className="w-full"
            error={errors.name?.message}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>
          <Textarea
            id="description"
            {...register("description")}
            className="min-h-[100px]"
            error={errors.description?.message}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="content" className="text-sm font-medium">
            Content
          </label>
          <Textarea
            id="content"
            {...register("content")}
            className="min-h-[200px]"
            error={errors.content?.message}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Featured Image</label>
          <ImageUpload
            value={watch("featuredImage")}
            onChange={(url) => setValue("featuredImage", url)}
            onRemove={() => setValue("featuredImage", "")}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Additional Images</label>
          <ImageUpload
            multiple
            value={watch("images")}
            onChange={(urls) => setValue("images", urls)}
            onRemove={(index) => {
              const currentImages = watch("images") || []
              setValue(
                "images",
                currentImages.filter((_, i) => i !== index)
              )
            }}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  )
} 