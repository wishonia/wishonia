import { Button } from '@/components/ui/button'

export function BlueprintButton() {
  return (
    <Button 
      className="relative px-8 py-8 text-lg text-white border-transparent bg-transparent hover:bg-transparent group"
    >
      <span className="relative z-10">Contribute to the Blueprint</span>
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#ff4895] via-[#00ffcc] to-[#ff8866] opacity-70 group-hover:opacity-100 transition-opacity animate-gradient-xy"></div>
      <div className="absolute inset-[1px] rounded-full bg-[#13111a] z-0"></div>
    </Button>
  )
} 