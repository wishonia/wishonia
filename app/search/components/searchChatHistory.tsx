'use client'

import { ChevronLeft, Menu } from 'lucide-react'
import { History as HistoryIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { Suspense } from 'react'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { useAppState } from '@/lib/utils/app-state'

import { HistorySkeleton } from './history-skeleton'

type HistoryProps = {
  location: 'sidebar' | 'header'
  children?: React.ReactNode
}

export function SearchChatHistory({ location, children }: HistoryProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const { isGenerating, setIsGenerating } = useAppState()

  const onOpenChange = (open: boolean) => {
    if (open) {
      startTransition(() => {
        router.refresh()
      })
    }
  }

  return (
    <Sheet onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn({
            'rounded-full text-foreground/30': location === 'sidebar'
          })}
          disabled={isGenerating}
        >
          {location === 'header' ? <Menu /> : <ChevronLeft size={16} />}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-64 rounded-tl-xl rounded-bl-xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-1 text-sm font-normal mb-2">
            <HistoryIcon size={14} />
            History
          </SheetTitle>
        </SheetHeader>
        <div className="my-2 h-full pb-12 md:pb-10">
          <Suspense fallback={<HistorySkeleton />}>{children}</Suspense>
        </div>
      </SheetContent>
    </Sheet>
  )
}
