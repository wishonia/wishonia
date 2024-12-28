"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { User } from "@prisma/client"
import { useRouter } from "next/navigation"
import * as React from "react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { FaRegClipboard } from "react-icons/fa"
import * as z from "zod"

import { Icons } from "@/components/icons"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { userNameSchema } from "@/lib/validations/user"

interface UserNameFormProps extends React.HTMLAttributes<HTMLFormElement> {
  user: Pick<User, "id" | "username">
}

type FormData = z.infer<typeof userNameSchema>

export function UserNameForm({ user, className, ...props }: UserNameFormProps) {
  const router = useRouter()
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setError,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(userNameSchema),
    defaultValues: {
      username: user?.username || "",
    },
  })

  const username = watch("username")
  const [shareLink, setShareLink] = useState("")

  useEffect(() => {
    // This will only be executed on the client side where `window` is defined
    setShareLink(`${window.location.origin}/${username}`)
  }, [username]) // Update the share link whenever the username changes

  async function onSubmit(data: FormData) {
    const response = await fetch(`/api/users/${user.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: data.username,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      setError("username", {
        type: "server",
        message: errorData.message || "An error occurred. Please try again.",
      })
      return toast({
        title: "Error updating username.",
        description:
          errorData.message || "Your name was not updated. Please try again.", // Use the message from the response
        variant: "destructive",
      })
    }

    toast({
      description: "Your username has been updated.",
    })

    router.refresh()
  }

  async function copyToClipboard() {
    await navigator.clipboard.writeText(shareLink)
    toast({
      description: "Link copied to clipboard!",
    })
  }

  return (
    <form
      className={cn(className)}
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle>Username</CardTitle>
          <CardDescription>Enter your publicly display name.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="username">
              Username
            </Label>
            <Input
              id="username"
              className="w-full lg:w-[400px]"
              size={32}
              {...register("username")}
            />
            {errors?.username && (
              <p className="px-1 text-xs text-red-600">
                {errors.username.message}
              </p>
            )}
            {/* Sharing Link Box */}
            <div className="mt-4">
              <Label htmlFor="shareLink">Your Share Link</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="shareLink"
                  className="w-full lg:w-[400px]"
                  size={32}
                  value={shareLink}
                  readOnly
                />
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className={cn(buttonVariants(), className)}
                >
                  <FaRegClipboard className="mr-2" />
                  Copy
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Earn WISH points for each new citizen that joins with your URL!
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <button
            type="submit"
            className={cn(buttonVariants(), className)}
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            <span>Save changes</span>
          </button>
        </CardFooter>
      </Card>
    </form>
  )
}
