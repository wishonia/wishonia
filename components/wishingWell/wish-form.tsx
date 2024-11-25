"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { wishSchema } from "@/lib/validations/wish"
import { toast } from "@/components/ui/use-toast"

interface WishFormProps extends React.HTMLAttributes<HTMLFormElement> {}

type FormData = z.infer<typeof wishSchema>

export function WishForm({ className, ...props }: WishFormProps) {
  const router = useRouter()
  const [isRedirecting, setIsRedirecting] = React.useState(false)
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

  const wish = watch("wish")

  async function onSubmit(data: FormData) {
    try {
      const response = await fetch(`/api/wish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wish: data.wish,
        }),
      })

      if (response.status === 409) {
        toast({
          title: "Already have a wish",
          description: "You already have an active wish in the wishing well.",
          variant: "destructive",
        })
        return
      }

      if (!response?.ok) {
        throw new Error("Failed to submit wish")
      }

      toast({
        description: "Your Wish has been updated.",
      })

      setIsRedirecting(true)
      router.push(`/dashboard/wishingWells`)
      router.refresh()
    } catch (error) {
      setIsRedirecting(false)
      toast({
        title: "Something went wrong.",
        description: "Your Wish was not updated. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isRedirecting) {
    return (
      <div className="w-full space-y-4 text-center">
        <div
          className="flex h-32 w-full items-center justify-center border-[6px]
                     border-black bg-white p-4 font-mono text-2xl font-black"
        >
          ✨ Making your wish come true... ✨
        </div>
        <div
          className="w-full border-[6px] border-black bg-black p-4 font-mono text-2xl
                     font-black text-white"
        >
          GRANTING...
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <textarea
        {...register("wish")}
        className="mb-4 h-32 w-full resize-none border-[6px] border-black
                 bg-white p-4 font-mono text-2xl
                 font-black placeholder-black focus:outline-none"
        placeholder="TYPE WISH"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full border-[6px] border-black bg-black p-4 font-mono text-2xl
                 font-black text-white transition-colors hover:bg-white
                 hover:text-black"
      >
        {isSubmitting ? "..." : "GRANT"}
      </button>
    </form>
  )
}
