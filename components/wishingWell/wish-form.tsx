"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { wishSchema } from "@/lib/validations/wish"
import { toast } from "@/components/ui/use-toast"
import { submitWish } from "@/app/actions/wish"

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
      await submitWish(data.wish)

      toast({
        description: "Your Wish has been created along with related problems, solutions, and a petition.",
      })

      setIsRedirecting(true)
      router.push(`/dashboard/wishingWells`)
      router.refresh()
    } catch (error) {
      setIsRedirecting(false)
      toast({
        title: "Something went wrong.",
        description: error instanceof Error ? error.message : "Your Wish was not created. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isRedirecting) {
    return (
      <div className="w-full space-y-4 text-center">
        <div
          className="flex h-32 w-full items-center justify-center border-[6px]
                     border-foreground bg-background p-4 font-mono text-2xl 
                     font-black text-foreground"
        >
          ✨ Making your wish come true... ✨
        </div>
        <div
          className="w-full border-[6px] border-foreground bg-foreground p-4 
                     font-mono text-2xl font-black text-background"
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
        className="mb-4 h-32 w-full resize-none border-[6px] border-foreground
                 bg-background p-4 font-mono text-2xl
                 font-black text-foreground placeholder-foreground/70 focus:outline-none
                 focus:caret-foreground caret-transparent animate-caret"
        placeholder="TYPE WISH"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full border-[6px] border-foreground bg-foreground p-4 
                 font-mono text-2xl font-black text-background transition-colors 
                 hover:bg-background hover:text-foreground disabled:opacity-50"
      >
        {isSubmitting ? "..." : "GRANT"}
      </button>
    </form>
  )
}
