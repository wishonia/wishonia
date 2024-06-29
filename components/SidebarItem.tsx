"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Chat as ChatIcon } from "@phosphor-icons/react"
import { motion } from "framer-motion"

import { useLocalStorage } from "@/lib/hooks/use-local-storage"
import { type Chat } from "@/lib/types"

interface SidebarItemProps {
  index: number
  chat: Chat
  children: React.ReactNode
}

function SidebarItem({ index, chat, children }: SidebarItemProps) {
  const pathname = usePathname()
  const isActive = pathname === chat.path
  const [newChatId, setNewChatId] = useLocalStorage("newChatId", null)

  const shouldAnimate = index === 0 && isActive && newChatId

  if (!chat?.id) return null

  return (
    <motion.div
      variants={{
        initial: {
          height: 0,
          opacity: 0,
        },
        animate: {
          height: "auto",
          opacity: 1,
        },
      }}
      initial="initial"
      animate="animate"
      transition={{
        duration: 0.25,
        ease: "easeIn",
      }}
      className="relative size-full"
    >
      <Link
        href={chat.path}
        className={`${
          isActive
            ? "bg-gray-400/40 font-normal shadow-md dark:bg-white/20"
            : "hover:bg-gray-200 hover:shadow-md dark:text-white/80 dark:hover:bg-gray-500/20"
        } flex w-full items-center gap-2 overflow-hidden whitespace-nowrap rounded-md px-2 py-1 text-sm font-light tracking-wide`}
        // prefetch={true}
      >
        <div>
          <ChatIcon size={16} />
        </div>
        <span className="... w-3/4 truncate whitespace-nowrap">
          {" "}
          {chat.title.split("").map((character, index) => {
            return (
              <motion.span
                key={index}
                variants={{
                  initial: {
                    opacity: 0,
                    x: -100,
                  },
                  animate: {
                    opacity: 1,
                    x: 0,
                  },
                }}
                initial="initial"
                animate="animate"
                transition={{
                  duration: 0.25,
                  ease: "easeIn",
                  delay: index * 0.025,
                  staggerChildren: 0.05,
                }}
                onAnimationComplete={() => {
                  if (index === chat.title.length - 1) {
                    setNewChatId(null)
                  }
                }}
              >
                {character}
              </motion.span>
            )
          })}
        </span>
      </Link>
      {isActive && <div className="absolute right-2 top-0">{children}</div>}
    </motion.div>
  )
}

export default SidebarItem
