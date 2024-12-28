"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import type { WishingWell } from "@prisma/client"
import { useRouter } from "next/navigation"
import * as React from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { ImageUpload } from "@/components/ui/image-upload"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"



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

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

const CustomTextarea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ error, className, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          ref={ref}
          className={cn(
            "w-full rounded border px-3 py-2",
            error ? "border-red-500" : "border-gray-300",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

CustomTextarea.displayName = "CustomTextarea";

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ error, className, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          ref={ref}
          className={cn(
            "w-full rounded border px-3 py-2",
            error ? "border-red-500" : "border-gray-300",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

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
      images: wishingWell.images || [],
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
            error={errors.name?.message}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>
          <CustomTextarea
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
          <CustomTextarea
            id="content"
            {...register("content")}
            className="min-h-[200px]"
            error={errors.content?.message}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Featured Image</label>
          <ImageUpload
            value={watch("featuredImage") ?? ""}
            onChange={(url: string | string[]) => {
              const finalUrl = Array.isArray(url) ? url[0] : url
              setValue("featuredImage", finalUrl)
            }}
            onRemove={() => setValue("featuredImage", "")}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Additional Images</label>
          <ImageUpload
            multiple
            value={watch("images") ?? []}
            onChange={(urls: string | string[]) => {
              const finalUrls = Array.isArray(urls) ? urls : [urls]
              setValue("images", finalUrls)
            }}
            onRemove={(index?: number) => {
              if (typeof index !== 'undefined') {
                const currentImages = watch("images") ?? []
                setValue(
                  "images",
                  currentImages.filter((_, i) => i !== index)
                )
              }
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