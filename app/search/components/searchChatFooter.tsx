import React from 'react'
import Link from 'next/link'
import { Github, MessageSquare, Twitter } from "lucide-react"
import { Button } from '@/components/ui/button'

const SearchChatFooter: React.FC = () => {
  return (
    <footer className="w-fit p-1 md:p-2 fixed bottom-0 right-0">
      <div className="flex justify-end">
        <Button
          variant={'ghost'}
          size={'icon'}
          className="text-muted-foreground/50"
        >
          <Link href="https://curedao.org/discord" target="_blank">
            <MessageSquare size={18} />
          </Link>
        </Button>
        <Button
          variant={'ghost'}
          size={'icon'}
          className="text-muted-foreground/50"
        >
          <Link href="https://x.com/thinkbynumbers" target="_blank">
            <Twitter size={18} />
          </Link>
        </Button>
        <Button
          variant={'ghost'}
          size={'icon'}
          className="text-muted-foreground/50"
        >
          <Link href="https://github.com/wishonia/wishonia" target="_blank">
            <Github size={18} />
          </Link>
        </Button>
      </div>
    </footer>
  )
}

export default SearchChatFooter
