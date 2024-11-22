"use client"

import { useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { cn } from "@/lib/utils"

import { type MenuItem } from "../lib/parseSummary"

interface DocsSidebarProps {
  menu: MenuItem[]
  onClose?: () => void
}

export default function DocsSidebar({ menu, onClose }: DocsSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(path)) {
      newExpanded.delete(path)
    } else {
      newExpanded.add(path)
    }
    setExpandedFolders(newExpanded)
  }

  const handleFileClick = (path: string) => {
    const params = new URLSearchParams(searchParams)
    const filePath = path.endsWith(".md") ? path : `${path}.md`
    params.set("file", filePath)
    router.push(`${pathname}?${params.toString()}`)
    onClose?.()
  }

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const isExpanded = expandedFolders.has(item.path)
    const paddingLeft = `${level * 1}rem`
    const currentFile = searchParams.get("file")?.replace(/\.md$/, "")
    const isActive = currentFile === item.path

    const hasChildren = item.children && item.children.length > 0

    return (
      <div key={item.path}>
        <button
          className={cn(
            "flex w-full items-center px-4 py-2 text-sm",
            "hover:bg-accent hover:text-accent-foreground",
            "transition-colors duration-200",
            !hasChildren && isActive && "bg-accent text-accent-foreground"
          )}
          style={{ paddingLeft }}
          onClick={() =>
            hasChildren ? toggleFolder(item.path) : handleFileClick(item.path)
          }
        >
          <span className="mr-2">
            {item.emoji || (hasChildren ? (isExpanded ? "📂" : "📁") : "📄")}
          </span>
          {item.title}
        </button>
        {isExpanded &&
          item.children?.map((child) => renderMenuItem(child, level + 1))}
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-10rem)] overflow-y-auto text-foreground">
      {menu.map((item) => renderMenuItem(item))}
    </div>
  )
}