"use client"

import * as React from "react"

import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils"
import { globalSolutionPatchSchema } from "@/lib/validations/globalSolution"
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
import {GlobalSolution} from "@prisma/client";
import {CopilotTextarea} from "@copilotkit/react-textarea";

interface GlobalSolutionEditFormProps extends React.HTMLAttributes<HTMLFormElement> {
  globalSolution: Pick<GlobalSolution, "id" | "name" | "description" >
}

type FormData = z.infer<typeof globalSolutionPatchSchema>

export function GlobalSolutionEditForm({
  globalSolution,
  className,
  ...props
}: GlobalSolutionEditFormProps) {
  const router = useRouter()
  const [content, setContent] = useState("");
  const [nameInput, setNameInput] = useState(globalSolution?.name || "");
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(globalSolutionPatchSchema),
    defaultValues: {
      name: globalSolution?.name || "",
      description: globalSolution?.description || "",
    },
  })

  // Watch for changes in the name input
  const name = watch("name");

  // Update the nameInput state whenever the name changes
  useEffect(() => {
    setNameInput(name);
  }, [name]);

  async function onSubmit(data: FormData) {
    const response = await fetch(`/api/globalSolutions/${globalSolution.id}`, {
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
        description: "Your GlobalSolution was not updated. Please try again.",
        variant: "destructive",
      })
    }

    toast({
      description: "Your GlobalSolution has been updated.",
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
          <CardTitle>{globalSolution.name}</CardTitle>
          {globalSolution.description && (
            <CardDescription>{globalSolution.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            <Label htmlFor="name">Global Solution Name</Label>
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
            <Label htmlFor="description">
              Short Description{" "}
            </Label>
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
                placeholder={`Please provide more details about the globalSolution: ${nameInput}`}
                autosuggestionsConfig={{
                  textareaPurpose: `More information about the globalSolution: ${nameInput}`,
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
            <span>Save Global Solution</span>
          </button>
        </CardFooter>
      </Card>
    </form>
  )
}
