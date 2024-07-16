"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { globalProblemSchema } from "@/lib/validations/globalProblem"
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

interface GlobalProblemFormProps
  extends React.HTMLAttributes<HTMLFormElement> {}

type FormData = z.infer<typeof globalProblemSchema>

export function GlobalProblemForm({
  className,
  ...props
}: GlobalProblemFormProps) {
  const router = useRouter()
  const [globalProblemNameInput, setGlobalProblemNameInput] = useState("")
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(globalProblemSchema),
    defaultValues: {
      name: "",
    },
  })

  // Watch for changes in the globalProblem input
  const name = watch("name")

  // Update the globalProblemNameInput state whenever the globalProblem changes
  useEffect(() => {
    setGlobalProblemNameInput(name)
  }, [name])

  async function onSubmit(data: FormData) {
    const response = await fetch(`/api/globalProblems`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
      }),
    })

    if (!response?.ok) {
      return toast({
        title: "Something went wrong.",
        description: "Your problem was not updated. Please try again.",
        variant: "destructive",
      })
    }
    const result = await response.json()
    const globalProblemId = result.id

    toast({
      description: "Your Problem has been updated.",
    })

    router.push(`/globalProblems/${globalProblemId}/settings`)
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
            <Label htmlFor="globalProblem">
              Enter name of the problem...
            </Label>
            <Input
              id="name"
              className="w-full lg:w-[400px]"
              size={32}
              placeholder="ex. Alzheimer's Disease, Fibromyalgia, or Tangled Headphone Wires, etc."
              {...register("name")}
            />
            {errors?.name && (
              <p className="px-1 text-xs text-red-600">{errors.name.message}</p>
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
            <span>Create Problem</span>
          </button>
        </CardFooter>
      </Card>
    </form>
  )
}
