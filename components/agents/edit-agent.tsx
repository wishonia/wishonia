'use client'

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { JSX, SVGProps, useState } from "react"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useSidebar } from "@/lib/hooks/use-sidebar"
import { useForm,useFieldArray } from "react-hook-form"
import { agentSchema } from "@/lib/validations/agent"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import {Trash,PlusCircle} from '@phosphor-icons/react'
import { Agent } from "@prisma/client"
import { Icons } from "../icons"
import axios from "axios"

interface AgentEditProps extends React.HTMLAttributes<HTMLFormElement> {
    agentData: Pick<Agent, "id" | "name" | "description" | "prompt" |"initialMessage"|"conversationStarters"|"avatar">
  }
  
type FormData = z.infer<typeof agentSchema>

export default function EditAgent({
    agentData,
    className,
    ...props
}:AgentEditProps) {
    const router=useRouter();
    const { isSidebarOpen } = useSidebar()
    const [loading,setLoading]=useState(false);
    const [avatar,setAvatar]=useState(agentData.avatar||null);
    const {
      handleSubmit,
      register,
      formState: { errors, isSubmitting },
      control,
      watch,
      setValue,
    }=useForm<FormData>({
        resolver:zodResolver(agentSchema),
        defaultValues:{
            name:agentData.name,
            description:agentData.description,
            prompt:agentData.prompt,
            initialMessage:agentData.initialMessage,
            conversationStarters:agentData.conversationStarters||['']
        }
    })
    const { fields, append, remove } = useFieldArray({
        control,
        name: "conversationStarters"
    });
    const navigateBack = () => window.history.back();

    async function onSubmit(data: FormData) {
        setLoading(true)
        const response = await fetch(`/api/agents/${agentData.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name:data.name,
            description:data.description,
            prompt:data.prompt,
            initialMessage:data.initialMessage,
            avatar:data.avatar,
            metadata:{
                conversationStarters:data.conversationStarters 
            }
          }),
        })
    
        if (!response?.ok) {
          setLoading(false)
          return toast({
            title: "Something went wrong.",
            description: "Agent was not updated . Please try again.",
            variant: "destructive",
          })
        }
        toast({
          description: "Your Agent has been updated.",
        })
        setLoading(false)
        router.back()
        router.refresh()
    }
    const name=watch('name');
    
    const handleUpload=async(event:any)=>{
        const file = event.target?.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                setAvatar(e.target?.result)
            };
            reader.readAsDataURL(file);
            
            setLoading(true)
            const response = await axios.post("/api/upload-avatar?image="+file.name, file, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
            const newImageUrl = response.data.imageUrl; 
            setValue('avatar',newImageUrl);
            setLoading(false)
        }
    }
    
    return (
        <div className={`flex mx-auto h-screen  ${isSidebarOpen?'lg:ml-[270px] lg:w-[calc(100%-270px)]':'w-full lg:w-[96%]'}`}>
            <div className="flex overflow-y-auto flex-col w-full md:w-1/2 p-8 space-y-6">
                <div className="flex items-center space-x-4">
                    <ArrowLeftIcon onClick={navigateBack} className="h-6 w-6 cursor-pointer" />
                    <h1 className="text-xl font-semibold ">{name||"New Agent"}</h1>
                </div>
                <form 
                  onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="border border-gray-400 h-20 w-20 rounded-full mx-auto overflow-hidden p-1 relative">
                               <Input type="file" onChange={handleUpload} className="w-full h-full opacity-0 absolute z-10" accept="image/png, image/gif, image/jpeg"/>
                               {avatar?<img className="w-full h-full" src={avatar}/>:null}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium ">
                                Name
                            </Label>
                            <Input 
                              placeholder="Name your Agent" 
                              {...register("name")}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-sm font-medium">
                                Description
                            </Label>
                            <Textarea
                                id="description"
                                placeholder="Add a short description about what this Agent does"
                                className="min-h-[100px]"
                                {...register("description")}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="instructions" className="text-sm font-medium ">
                                Instructions
                            </Label>
                            <Textarea
                                id="instructions"
                                placeholder="What does this Agent do? How does it behave? What should it avoid doing?"
                                className="min-h-[100px]"
                                {...register("prompt")}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="initial-message" className="text-sm font-medium ">
                              Initial Message
                            </Label>
                            <Textarea
                                id="initial-message"
                                placeholder="Enter Initial Message"
                                className="min-h-[100px]"
                                {...register("initialMessage")}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="conversation-starters" className="text-sm font-medium flex items-center">
                                Conversation Starters <PlusCircle onClick={()=>append('')} className="ml-2 p-1 cursor-pointer hover:shadow-md rounded-full  w-7 h-7"/>
                            </Label>
                            {fields.map((item: any, index: number) => {
                                return (
                                    <div className="flex">
                                    <Input
                                        {...register(`conversationStarters.${index}`, { required: true })}   
                                        placeholder="Enter conversation starters"
                                    />
                                    <Button type="button" onClick={() => remove(index)} className="p-3 ml-2" disabled={fields.length===1} ><Trash/></Button>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="space-y-4">
                    
                        {/* <div className="space-y-2">
                            <Label className="text-sm font-medium ">Capabilities</Label>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="web-browsing" />
                                <Label htmlFor="web-browsing" className="text-sm">
                                    Web Browsing
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="image-generation" />
                                <Label htmlFor="image-generation" className="text-sm">
                                    DALL-E: Image Generation
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="code-interpreter" />
                                <Label htmlFor="code-interpreter" className="text-sm">
                                    Code Interpreter & Data Analysis
                                </Label>
                            </div>
                        </div> */}
                        <Button variant="outline" disabled={loading} className="dark:bg-white dark:text-black bg-black text-white">
                          {
                            loading ?
                            <Icons.spinner className="animate-spin text-sm"/>
                            :
                            "Create new action"
                          }
                        </Button>
                    </div>
                    </div>
                    
                </form>
            </div>
            <div className="w-1/2 bg-secondary p-8 hidden md:block">
                <div className="flex flex-col h-full justify-between">
                    <div className="flex items-center justify-center h-full">
                        <CuboidIcon className="h-12 w-12 text-gray-400" />
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-400">Start by defining your Agent.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ArrowLeftIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
        </svg>
    )
}


function CuboidIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
            <path d="m21.12 6.4-6.05-4.06a2 2 0 0 0-2.17-.05L2.95 8.41a2 2 0 0 0-.95 1.7v5.82a2 2 0 0 0 .88 1.66l6.05 4.07a2 2 0 0 0 2.17.05l9.95-6.12a2 2 0 0 0 .95-1.7V8.06a2 2 0 0 0-.88-1.66Z" />
            <path d="M10 22v-8L2.25 9.15" />
            <path d="m10 14 11.77-6.87" />
        </svg>
    )
}
