"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { File, GithubLogo, Globe } from "@phosphor-icons/react"
import {DatasourceType} from "@prisma/client";
import axios from "axios"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { dataSourceSchema } from "@/lib/validations/dataSourceSchema"

import { Icons } from "../icons"
import { Input } from "../ui/input"

import DataSourceIcon from "./data-source-icon"


type ButtonKeys = "FILE" | "GITHUB_REPOSITORY" | "URL"

const Buttons = {
  FILE: (
    <>
      <File className="mr-2" /> FILE
    </>
  ),
  GITHUB_REPOSITORY: (
    <>
      <GithubLogo className="mr-2" /> GitHub
    </>
  ),
  URL: (
    <>
      <Globe className="mr-2" /> URL
    </>
  ),
}

const InputProps = {
  FILE: {
    placeholder: "Upload PDF File",
    type: "file",
    accept:
      "application/pdf,text/plain,text/markdown,text/csv,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  },
  GITHUB_REPOSITORY: { placeholder: "Enter GitHub Link Here", type: "text" },
  URL: { placeholder: "Enter Website Url", type: "text" },
}

type FormData = z.infer<typeof dataSourceSchema>

interface DataSourceProps {
  agentId?: string
  open: boolean
  onClose: () => void
  dataSource: FormData[]
  setDataSource: React.Dispatch<React.SetStateAction<FormData[]>>
}

export default function AddAgentDataSource({
  open,
  onClose,
  agentId,
  dataSource,
  setDataSource,
}: DataSourceProps) {
  const [loading, setLoading] = useState<boolean>(false)
  const [uploading, setUploading] = useState<boolean>(false)
  const [fileType, setFileType] = useState<string>("")
  const {
    handleSubmit,
    register,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(dataSourceSchema),
    defaultValues: {
      name: "",
      content: "",
      description: "",
      url: "",
      type: DatasourceType.GITHUB_REPOSITORY,
    },
  })

  const type = watch("type")

  useEffect(() => {
    setValue("url", "")
    setValue("type", type)
  }, [type])

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true)
      const response = await axios.post("/api/datasource", {
        ...data,
        agentId: agentId,
        type: type == "FILE" ? fileType : type,
      })
      if (response.status == 201) {
        setDataSource((prev) => [...prev, response.data])
        toast({
          description: "Your Datasource has been created.",
        })
        handleClose()
      }
    } catch {
      toast({
        title: "Something went wrong.",
        description: "Datasource was not  created. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const mapMimeTypeToFileType = (mimeType: string): string => {
    const typeMapping: { [key: string]: string } = {
      "text/plain": "TXT",
      "application/pdf": "PDF",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        "PPTX",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        "DOCX",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        "XLSX",
      "text/markdown": "MARKDOWN",
      "text/csv": "CSV",
    }

    return typeMapping[mimeType] || "UNKNOWN"
  }
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files?.[0]
    if (file) {
      setUploading(true)
      const response = await axios.post(
        "/api/upload-document?document=" + file.name,
        file,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      const newDocumentUrl = response.data.documentUrl
      setValue("url", newDocumentUrl)
      setFileType(mapMimeTypeToFileType(file.type))
      setUploading(false)
    }
  }

  const handleClose = () => {
    reset({
      name: "",
      content: "",
      description: "",
      url: "",
      type: DatasourceType.GITHUB_REPOSITORY,
    })
    onClose()
  }

  return (
    <>
      <AlertDialog open={open} onOpenChange={handleClose}>
        <AlertDialogContent className="">
          <AlertDialogHeader>
            <AlertDialogTitle>
              Add New Data Source
            </AlertDialogTitle>
            <AlertDialogDescription>
              Fill in the details below to add a new data source for your agent.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mx-auto w-full max-w-md rounded-lg  p-8"
          >
            <div className="mb-6">
              <div className="grid grid-cols-3 gap-4">
                {Object.keys(Buttons).map((key: any) => {
                  const buttonKey = key as ButtonKeys
                  return (
                    <Button
                      type="button"
                      key={key}
                      onClick={() => setValue("type", key)}
                      className={`bg-white text-black hover:bg-gray-800  hover:text-white dark:bg-[#333333] dark:text-white ${type === key ? "bg-black text-white dark:bg-white dark:text-black" : ""}`}
                    >
                      {Buttons[buttonKey]}
                    </Button>
                  )
                })}
              </div>
            </div>
            <div className="mb-4">
              <div className="space-y-2">
                <Label
                  htmlFor="chat-model"
                  className="mb-2 block text-sm font-semibold"
                >
                  Enter Name
                </Label>
                <Input {...register("name")} />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="chat-model"
                  className="mb-2 block text-sm font-semibold"
                >
                  Enter Datasource
                </Label>
                {type == "FILE" ? (
                  <>
                    <Input
                      onChange={handleUpload}
                      {...InputProps[type as ButtonKeys]}
                    />
                    {uploading ? (
                      <>
                        <span>Uploading</span>
                        <span className="mx-1 inline-block animate-bounce [animation-delay:-0.3s]">
                          .
                        </span>
                        <span className="mx-1 inline-block animate-bounce [animation-delay:-0.15s]">
                          .
                        </span>
                        <span className="mx-1 inline-block animate-bounce">
                          .
                        </span>
                      </>
                    ) : null}
                  </>
                ) : (
                  <Input
                    {...register("url")}
                    {...InputProps[type as ButtonKeys]}
                  />
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-1 text-black">
              {dataSource.map((item: FormData) => (
                <div
                  key={item.id}
                  className="flex w-max items-center bg-secondary p-2 text-xs dark:text-white"
                >
                  <DataSourceIcon iconName={item.type} className="mx-1" />{" "}
                  {item.name}
                </div>
              ))}
            </div>
            <div className="ml-auto mt-10 flex w-max">
              <Button
                type="button"
                variant="link"
                disabled={loading || uploading}
                onClick={handleClose}
                className="mr-3 font-bold"
              >
                Close
              </Button>
              <Button
                type="submit"
                className="rounded-md py-3 disabled:opacity-55"
                variant="secondary"
                disabled={loading || uploading}
              >
                {loading ? (
                  <Icons.spinner className="animate-spin text-sm" />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

