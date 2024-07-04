"use client"

import React, { JSX, SVGProps, useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  File,
  GithubLogo,
  Globe,
} from "@phosphor-icons/react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { dataSourceSchema } from "@/lib/validations/dataSourceSchema"
import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "../ui/input"
import axios from "axios"
import { Icons } from "../icons"
import { toast } from "@/components/ui/use-toast"
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
  FILE: { placeholder: "Upload PDF File", type: "file" ,accept:"application/pdf,text/plain,text/markdown,text/csv,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"},
  GITHUB_REPOSITORY: { placeholder: "Enter GitHub Link Here", type: "text" },
  URL: { placeholder: "Enter Webiste Url Here", type: "text" }
}

type FormData = z.infer<typeof dataSourceSchema>

interface DataSourceProps {
  agentId?: string
  open: boolean
  onClose: () => void
  dataSource:FormData[]
  setDataSource: React.Dispatch<React.SetStateAction<FormData[]>>
}

export default function AddAgentDataSource({
  open,
  onClose,
  agentId,
  dataSource,
  setDataSource,
}: DataSourceProps) {
  const [loading,setLoading]=useState<boolean>(false);
  const [uploading,setUploading]=useState<boolean>(false);
  const [fileType,setFileType]=useState<string>("")
  const { handleSubmit, register,reset, control, watch, setValue,formState:{errors} } =
    useForm<FormData>({
      resolver: zodResolver(dataSourceSchema),
      defaultValues: {
        name: "",
        content: "",
        description: "",
        url: "",
        type: "GITHUB_REPOSITORY",
      },
    })

  const type = watch("type")

  useEffect(() => {
    setValue("url", "")
    setValue("type",type)
  }, [type])


  const onSubmit=async(data:FormData)=>{
    try{
     setLoading(true)
     const response=await axios.post('/api/datasource',{...data,
      agentId:agentId,
      type:type=='FILE'?fileType:type
    });
     if(response.status==201){
      setDataSource(prev=>[...prev,response.data])
      toast({
        description: 'Your Datasource has been created.',
      })
      handleClose();
     }
    }catch{
      toast({
        title: "Something went wrong.",
        description: "Datasource was not  created. Please try again.",
        variant: "destructive",
      })
    }
    finally{
      setLoading(false)
    }
  }

  const mapMimeTypeToFileType=(mimeType: string): string=> {
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

  const handleClose=()=>{
    reset({
      name: "",
      content: "",
      description: "",
      url: "",
      type: "GITHUB_REPOSITORY",
    });
    onClose();
  }

  return (
    <>
      <AlertDialog open={open} onOpenChange={handleClose}>
        <AlertDialogContent className="">
          <form onSubmit={handleSubmit(onSubmit)} className="mx-auto w-full max-w-md rounded-lg  p-8">
            <h1 className="mb-6 text-3xl font-bold">Create a new datasource</h1>
            <div className="mb-6">
              <h2 className="mb-4 text-lg font-semibold">
                Select a data source
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {Object.keys(Buttons).map((key: any) => {
                  const buttonKey = key as ButtonKeys
                  return (
                    <Button
                      type="button"
                      key={key}
                      onClick={() => setValue("type", key)}
                      className={`bg-white text-black dark:bg-[#333333]  dark:text-white hover:bg-gray-800 hover:text-white ${type === key ? "bg-black text-white dark:bg-white dark:text-black" : ""}`}
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
               {type=='FILE'?
               <>
               <Input  onChange={handleUpload} {...InputProps[type as ButtonKeys]}/>
                {uploading?<>
                  <span>Uploading</span>
                  <span className='inline-block mx-1 animate-bounce [animation-delay:-0.3s]'>.</span>
	                <span className='inline-block mx-1 animate-bounce [animation-delay:-0.15s]'>.</span>
	                <span className='inline-block mx-1 animate-bounce'>.</span>
                </>:null}
               </>
              :<Input {...register("url")} {...InputProps[type as ButtonKeys]} />}
              </div>
            </div>
            <div className="flex flex-wrap text-black gap-1">
              {dataSource.map((item:FormData)=>(
                <div key={item.id} className="flex items-center bg-secondary dark:text-white p-2 text-xs w-max">
                <DataSourceIcon iconName={item.type} className="mx-1"/> {item.name}
                </div>
              ))}
            </div>
            <div className="ml-auto flex w-max mt-10">
              <Button type="button" variant='link' disabled={loading||uploading} onClick={handleClose} className="mr-3 font-bold">
                Close
              </Button>
              <Button
                type="submit"
                className="rounded-md py-3 disabled:opacity-55"
                variant="secondary"
                disabled={loading||uploading}
              >
               {loading ? (
                <Icons.spinner className="animate-spin text-sm" />
              ):"Save"} 
              </Button>
            </div>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function MapIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z" />
      <path d="M15 5.764v15" />
      <path d="M9 3.236v15" />
    </svg>
  )
}
