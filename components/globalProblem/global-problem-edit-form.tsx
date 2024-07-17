"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CopilotTextarea } from "@copilotkit/react-textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { GlobalProblem } from "@prisma/client"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { globalProblemPatchSchema } from "@/lib/validations/globalProblem"
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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

interface GlobalProblemEditFormProps
  extends React.HTMLAttributes<HTMLFormElement> {
  globalProblem: Pick<GlobalProblem, "id" | "name" | "description">
}

type FormData = z.infer<typeof globalProblemPatchSchema>

export function GlobalProblemEditForm({
  globalProblem,
  className,
  ...props
}: GlobalProblemEditFormProps) {
  const router = useRouter()
  const [content, setContent] = useState("")
  const [nameInput, setNameInput] = useState(globalProblem?.name || "")
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(globalProblemPatchSchema),
    defaultValues: {
      name: globalProblem?.name || "",
      description: globalProblem?.description || "",
    },
  })

  // Watch for changes in the name input
  const name = watch("name")

  // Update the nameInput state whenever the name changes
  useEffect(() => {
    setNameInput(name)
  }, [name])

  async function onSubmit(data: FormData) {
    const response = await fetch(`/api/globalProblems/${globalProblem.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        description: data.description,
        content: data.content,
      }),
    })

    if (!response?.ok) {
      return toast({
        title: "Something went wrong.",
        description: "Your GlobalProblem was not updated. Please try again.",
        variant: "destructive",
      })
    }

    toast({
      description: "Your GlobalProblem has been updated.",
    })

    router.back()
    router.refresh()
  }

  return (
    <form
      className={cn(className)}
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <Card>
        <CardHeader>
          <CardTitle>{globalProblem.name}</CardTitle>
          {globalProblem.description && (
            <CardDescription>{globalProblem.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            <Label htmlFor="name">Problem Name</Label>
            <Input
              id="name"
              className="w-full lg:w-[400px]"
              size={32}
              placeholder="ex. everyone had a free superintelligent robot doctor"
              {...register("name")}
            />
            {errors?.name && (
              <p className="px-1 text-xs text-red-600">{errors.name.message}</p>
            )}
          </div>
          <div className="grid gap-3">
            <Label htmlFor="description">Short Description </Label>
            <Textarea
              id="description"
              className="w-full lg:w-[400px]"
              {...register("description")}
            />
            {errors?.description && (
              <p className="px-1 text-xs text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>
          {/*          <div className="grid gap-3">
            <Label htmlFor="content">
              Longer Detailed Description{" "}
            </Label>
            <CopilotTextarea
                style={{ "--copilot-kit-background-color": "#000000" } as any}
                id="content"
                className="px-4 py-4"
                value={content}
                onValueChange={(value: string) => setContent(value)}
                placeholder={`Please provide more details about the globalProblem: ${nameInput}`}
                autosuggestionsConfig={{
                  textareaPurpose: `More information about the globalProblem: ${nameInput}`,
                  chatApiConfigs: {
                    suggestionsApiConfig: {
                      forwardedParams: {
                        max_tokens: 20,
                        stop: [".", "?", "!"],
                      },
                    },
                  },
                }}
            />

          </div>*/}
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
            <span>Save Problem</span>
          </button>
        </CardFooter>
      </Card>
    </form>
  )
}
