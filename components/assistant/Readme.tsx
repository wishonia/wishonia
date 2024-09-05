"use client"

import { cn } from "@/lib/utils"
import { CustomReactMarkdown } from "../CustomReactMarkdown"

export function Readme({ props: readme }: { props: string }) {
  return (
    <div className={cn("group flex w-full items-start")}>
      <div className="w-full flex-1 space-y-2 overflow-hidden px-1">
        <CustomReactMarkdown>
          {typeof readme === "string" ? readme : JSON.stringify(readme)}
        </CustomReactMarkdown>
      </div>
    </div>
  )
}
