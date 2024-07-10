"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
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
import { Icons } from "@/components/icons"

// Define the schema for the form data
const dFDATokenSchema = z.object({
  token: z.string().min(1, "Token is required"),
})

type FormData = z.infer<typeof dFDATokenSchema>

interface DFDATokenFormProps extends React.HTMLAttributes<HTMLFormElement> {
  userId: string
}

export function DFDATokenForm({ userId, className, ...props }: DFDATokenFormProps) {
  const router = useRouter()
  const [isTokenVisible, setIsTokenVisible] = useState(false)
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(dFDATokenSchema),
  })

  async function onSubmit(data: FormData) {
    try {
      const response = await fetch(`/api/account/dfda`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          token: data.token,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to add dFDA token")
      }

      toast({
        description: "Your dFDA token has been added successfully.",
      })

      router.refresh()
    } catch (error) {
      setError("token", {
        type: "server",
        message: error instanceof Error ? error.message : "An error occurred. Please try again.",
      })
      toast({
        title: "Error adding dFDA token.",
        description: error instanceof Error ? error.message : "Your token was not added. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
      <form
          className={cn(className)}
          onSubmit={handleSubmit(onSubmit)}
          {...props}
      >
        <Card>
          <CardHeader>
            <CardTitle>dFDA Access Token</CardTitle>
            <CardDescription>Enter your dFDA access token to connect your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-1">
              <Label className="sr-only" htmlFor="token">
                dFDA Token
              </Label>
              <div className="relative">
                <Input
                    id="token"
                    className="w-full lg:w-[400px] pr-10"
                    type={isTokenVisible ? "text" : "password"}
                    {...register("token")}
                />
                <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    onClick={() => setIsTokenVisible(!isTokenVisible)}
                >
                  {isTokenVisible ? (
                      <Icons.eyeOff className="h-4 w-4" />
                  ) : (
                      <Icons.eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors?.token && (
                  <p className="px-1 text-xs text-red-600">
                    {errors.token.message}
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
              <span>Add Token</span>
            </button>
          </CardFooter>
        </Card>
      </form>
  )
}