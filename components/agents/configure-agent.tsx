import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { JSX, SVGProps } from "react"


import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {Checkbox} from "@radix-ui/themes";
export default function ConfigureAgent() {
    return (
        <div className="flex h-screen bg-[#121212]">
            <div className="flex flex-col w-1/2 p-8 space-y-6">
                <div className="flex items-center space-x-4">
                    <ArrowLeftIcon className="text-white h-6 w-6" />
                    <h1 className="text-xl font-semibold text-white">New Agent</h1>
                    <span className="ml-auto px-3 py-1 text-sm font-medium text-yellow-500 bg-yellow-600 rounded-full">
            Draft
          </span>
                </div>
                <div className="flex space-x-4">
                    <Button className="bg-white text-black">Create</Button>
                    <Button variant="outline" className="border-white text-white">
                        Configure
                    </Button>
                </div>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium text-white">
                            Name
                        </Label>
                        <Input id="name" placeholder="Name your Agent" className="bg-[#1E1E1E] text-white" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-medium text-white">
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            placeholder="Add a short description about what this Agent does"
                            className="bg-[#1E1E1E] text-white min-h-[100px]"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="instructions" className="text-sm font-medium text-white">
                            Instructions
                        </Label>
                        <Textarea
                            id="instructions"
                            placeholder="What does this Agent do? How does it behave? What should it avoid doing?"
                            className="bg-[#1E1E1E] text-white min-h-[100px]"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="conversation-starters" className="text-sm font-medium text-white">
                            Conversation starters
                        </Label>
                        <Textarea
                            id="conversation-starters"
                            placeholder="Enter conversation starters"
                            className="bg-[#1E1E1E] text-white min-h-[100px]"
                        />
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="knowledge" className="text-sm font-medium text-white">
                            Knowledge
                        </Label>
                        <p className="text-sm text-gray-400">
                            If you upload files under Knowledge, conversations with your Agent may include file contents. Files can be
                            downloaded when Code Interpreter is enabled
                        </p>
                        <Button className="bg-white text-black">Upload files</Button>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-white">Capabilities</Label>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="web-browsing" />
                            <Label htmlFor="web-browsing" className="text-sm text-white">
                                Web Browsing
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="image-generation" />
                            <Label htmlFor="image-generation" className="text-sm text-white">
                                DALL-E: Image Generation
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="code-interpreter" />
                            <Label htmlFor="code-interpreter" className="text-sm text-white">
                                Code Interpreter & Data Analysis
                            </Label>
                        </div>
                    </div>
                    <Button variant="outline" className="border-white text-white">
                        Create new action
                    </Button>
                </div>
            </div>
            <div className="w-1/2 bg-[#1E1E1E] p-8">
                <div className="flex flex-col h-full justify-between">
                    <div className="flex items-center justify-center h-full">
                        <CuboidIcon className="text-white h-12 w-12" />
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
