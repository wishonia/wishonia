"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { wishSchema } from "@/lib/validations/wish"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

interface WishFormProps extends React.HTMLAttributes<HTMLFormElement> {}

type FormData = z.infer<typeof wishSchema>

export function WishForm({ className, ...props }: WishFormProps) {
  const router = useRouter()
  const [wishInput, setWishInput] = useState("")
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(wishSchema),
    defaultValues: {
      wish: "",
    },
  })

  // Watch for changes in the wish input
  const wish = watch("wish")

  // Update the wishInput state whenever the wish changes
  useEffect(() => {
    setWishInput(wish)
  }, [wish])

  async function onSubmit(data: FormData) {
    const response = await fetch(`/api/wish`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        wish: data.wish,
      }),
    })

    if (!response?.ok) {
      return toast({
        title: "Something went wrong.",
        description: "Your Wish was not updated. Please try again.",
        variant: "destructive",
      })
    }

    toast({
      description: "Your Wish has been updated.",
    })

    router.push(`/dashboard/wishingWells`)
    router.refresh()
  }

  return (
    <form
      className={cn(className)}
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <Card>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            <Label htmlFor="wish">I wish...</Label>
            <Input
              id="wish"
              className="w-full lg:w-[400px]"
              size={32}
              placeholder="ex. everyone had a free superintelligent robot doctor"
              {...register("wish")}
            />
            {errors?.wish && (
              <p className="px-1 text-xs text-red-600">{errors.wish.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            type="submit"
            className={cn(buttonVariants(), className)}
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            <span>Make Wish</span>
          </button>
        </CardFooter>
      </Card>
    </form>
  )
}
