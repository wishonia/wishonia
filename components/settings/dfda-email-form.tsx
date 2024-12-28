"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useSearchParams } from "next/navigation"
import * as React from "react"
import { useForm } from "react-hook-form"
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

const dFDAEmailSchema = z.object({
  email: z.string().email("Invalid email address"),
})

type FormData = z.infer<typeof dFDAEmailSchema>

type DFDALoginFormProps = React.HTMLAttributes<HTMLFormElement>

export function DFDAEmailForm({ className, ...props }: DFDALoginFormProps) {

  const searchParams = useSearchParams()
  const [isProcessingToken, setIsProcessingToken] = React.useState(false)

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(dFDAEmailSchema),
  })

  React.useEffect(() => {
    if (searchParams) {
      const accessToken = searchParams.get('accessToken')
      if (accessToken) {
        setIsProcessingToken(true)
        handleAccessToken(accessToken)
      }
    }
  }, [searchParams])

  async function handleAccessToken(accessToken: string) {
    try {
      const response = await fetch(`/api/dfda/access-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accessToken }),
      })

      if (!response.ok) {
        throw new Error("Failed to process access token")
      }

      toast({
        description: "Access token processed successfully.",
      })

      // Optionally, redirect to a dashboard or home page
      // router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Error processing access token.",
        description: error instanceof Error ? error.message : "An error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessingToken(false)
    }
  }

  async function onSubmit(data: FormData) {
    try {
      const response = await fetch(`/api/dfda/passwordless-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          intended_url: window.location.href,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to initiate passwordless login")
      }

      toast({
        description: "Check your email for the login link.",
      })

      // Optionally, redirect to a "check your email" page
      // router.push("/check-email")
    } catch (error) {
      setError("email", {
        type: "server",
        message: error instanceof Error ? error.message : "An error occurred. Please try again.",
      })
      toast({
        title: "Error initiating passwordless login.",
        description: error instanceof Error ? error.message : "Failed to send login email. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isProcessingToken) {
    return (
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-center items-center">
              <Icons.spinner className="h-6 w-6 animate-spin" />
              <span className="ml-2">Processing access token...</span>
            </div>
          </CardContent>
        </Card>
    )
  }

  return (
      <form
          className={cn(className)}
          onSubmit={handleSubmit(onSubmit)}
          {...props}
      >
        <Card>
          <CardHeader>
            <CardTitle>dFDA Login</CardTitle>
            <CardDescription>Enter your email to receive a login link or use the provided access token.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-1">
              <Label htmlFor="email">Email</Label>
              <Input
                  id="email"
                  type="email"
                  className="w-full lg:w-[400px]"
                  {...register("email")}
              />
              {errors?.email && (
                  <p className="px-1 text-xs text-red-600">
                    {errors.email.message}
                  </p>
              )}
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
              <span>Send Login Link</span>
            </button>
          </CardFooter>
        </Card>
      </form>
  )
}