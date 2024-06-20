import { Badge } from "@/components/ui/badge"
import { JSX, SVGProps } from "react"

export default function AgentList() {
    return (
        <div className="bg-[#121212] text-white p-8">
            <h1 className="text-3xl font-semibold mb-6">My Agents</h1>
            <div className="flex items-center space-x-4 mb-4">
                <PlusIcon className="bg-[#333333] p-2 rounded-full h-8 w-8"/>
                <div>
                    <div className="font-semibold">Create a Agent</div>
                    <div className="text-[#BBBBBB]">Customize a version of Agent for a specific purpose</div>
                </div>
            </div>
            <div className="border-t border-[#333333] pt-4">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                        <HexagonIcon className="bg-[#333333] p-2 rounded-full h-8 w-8"/>
                        <div>
                            <div className="font-semibold">Decentralized FDA Architect</div>
                            <div className="text-[#BBBBBB]">
                                A planning agent designed to act as a project manager for realizing a decentralized FDA
                                powered ...
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Badge variant="secondary">Only me</Badge>
                        <PencilIcon className="h-5 w-5"/>
                        <DotIcon className="h-5 w-5"/>
                    </div>
                </div>
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                        <HexagonIcon className="bg-[#333333] p-2 rounded-full h-8 w-8"/>
                        <div>
                            <div className="font-semibold">FDAi Docs Improver</div>
                            <div className="text-[#BBBBBB]">This improves the mintlify docs for the FDAi API</div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Badge variant="secondary">3 Chats</Badge>
                        <Badge variant="secondary">Anyone with a link</Badge>
                        <PencilIcon className="h-5 w-5"/>
                        <DotIcon className="h-5 w-5"/>
                    </div>
                </div>
            </div>
        </div>
    )
}

function DotIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
            <circle cx="12.1" cy="12.1" r="1" />
        </svg>
    )
}


function HexagonIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        </svg>
    )
}


function PencilIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            <path d="m15 5 4 4" />
        </svg>
    )
}


function PlusIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </svg>
    )
}