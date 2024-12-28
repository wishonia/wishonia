"use client"

import React, { useState } from "react"

import { LinkCard } from "@/components/link-card"
import { AskAISearchDialog } from "@/components/search-dialog/AskAISearchDialog"
import { markdownPages } from "@/lib/markdownPages"

export default function MarkdownPagesList() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPages = markdownPages.filter(
    (mdPage) =>
      mdPage.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mdPage.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="mx-auto max-w-xl py-8">
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 w-full p-2"
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "5px 0",
        }}
      >
        <hr style={{ flex: 1 }} />
        <span style={{ margin: "0 10px" }}>OR</span>
        <hr style={{ flex: 1 }} />
      </div>
      <div
        style={{
          display: "flex",
          marginBottom: "10px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <AskAISearchDialog />
      </div>
      {filteredPages.map((mdPage, idx) => (
        <div className="mb-4" key={idx}>
          <LinkCard
            navItem={{
              title: mdPage.name,
              tooltip: mdPage.description,
              disabled: false,
              external: false,
              img: mdPage.featuredImage,
              icon: undefined,
              href: mdPage.url.toString(),
            }}
            {...mdPage}
          />
        </div>
      ))}
    </div>
  )
}
