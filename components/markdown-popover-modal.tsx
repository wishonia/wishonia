"use client"

import * as React from "react"
import MarkdownRenderer from "@/components/MarkdownRenderer";
import {DialogTrigger, DialogContent, Dialog} from "@/components/ui/dialog"

interface MarkdownPopoverModalProps {
    name: string;
    description: string | null;
    featuredImage: string | null;
    content: string | null;
    dialogTrigger: React.ReactNode;
}

export function MarkdownPopoverModal({
    name,
    description,
    featuredImage,
    content,
    dialogTrigger
}: MarkdownPopoverModalProps) {

    return (
        <Dialog defaultOpen={false}>
            <DialogTrigger asChild>
                {dialogTrigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] w-full max-h-[90vh] overflow-auto rounded-lg">
                <div className="relative">
                    <div className="p-6 sm:p-8">
                        <div className="space-y-4">
                            <MarkdownRenderer name={name} description={description}
                                              featuredImage={featuredImage}
                                              content={content}/>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

function XIcon(props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) {
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
            <path d="M18 6 6 18"/>
            <path d="m6 6 12 12"/>
        </svg>
    )
}