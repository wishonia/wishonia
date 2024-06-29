"use client"

import * as React from "react"
import { Moon, Sun } from "@phosphor-icons/react"
import { useTheme } from "next-themes"

import { Button } from "./ui/button"

function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  return (
    <Button
      variant="outline"
      className="px-2"
      onClick={() => {
        setTheme(resolvedTheme === "light" ? "dark" : "light")
      }}
    >
      {resolvedTheme === "dark" ? (
        <span className="flex w-full items-center justify-between gap-2">
          Theme
          <Moon size={18} />
        </span>
      ) : (
        <span className="flex w-full items-center justify-between gap-2">
          Theme
          <Sun size={18} />
        </span>
      )}
    </Button>
  )
}

export default ThemeToggle
