import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface RainbowButtonProps {
  text: string
  tooltip?: string
  href?: string
  onClick?: () => void
  className?: string
}

export function RainbowButton({ text, tooltip, href, onClick, className = "" }: RainbowButtonProps) {
  const ButtonContent = () => (
    <Button 
      onClick={onClick}
      className={`relative px-4 py-6 text-lg text-white border-transparent bg-transparent hover:bg-transparent group ${className}`}
    >
      <span className="relative z-10">{text}</span>
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#ff4895] via-[#00ffcc] to-[#ff8866] opacity-70 group-hover:opacity-100 transition-opacity animate-gradient-xy" />
      <div className="absolute inset-[1px] rounded-full bg-[#13111a] z-0" />
    </Button>
  )

  const button = tooltip ? (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <ButtonContent />
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    <ButtonContent />
  )

  if (href) {
    return <Link href={href}>{button}</Link>
  }

  return button
} 