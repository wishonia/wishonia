import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'

export function NavBar() {
  const menuItems = [
    { href: '/', label: 'Home' },
    { href: 'https://studies.dfda.earth', label: 'Studies' },
    { href: 'https://safe.dfda.earth', label: 'App' },
    { href: 'https://docs.curedao.org', label: 'Litepaper' },
    { href: 'https://github.com/curedao', label: 'GitHub' },
  ]

  return (
    <nav className="w-full py-4 absolute top-0 z-50">
      <div className="container mx-auto flex items-center justify-between px-6">
        <Link href="/" className="text-2xl font-bold text-white">
          CUREDAO
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-neutral-200 hover:text-white transition-colors text-sm"
            >
              {item.label}
            </Link>
          ))}
          
          <Button 
            variant="outline" 
            className="relative px-6 py-2 text-sm text-white border-transparent bg-transparent hover:bg-transparent group"
          >
            <span className="relative z-10">Join Us</span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#ff4895] via-[#00ffcc] to-[#ff8866] opacity-70 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute inset-[1px] rounded-full bg-[#13111a] z-0"></div>
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-[#13111a] border-neutral-800">
              <SheetTitle className="sr-only">Links</SheetTitle>
              <SheetDescription className="sr-only">
                Navigation menu for mobile devices
              </SheetDescription>
              <div className="flex flex-col gap-4 mt-8">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-neutral-200 hover:text-white transition-colors text-lg"
                  >
                    {item.label}
                  </Link>
                ))}
                <Button 
                  variant="outline" 
                  className="relative px-6 py-2 text-sm text-white border-transparent bg-transparent hover:bg-transparent group mt-4 w-full"
                >
                  <span className="relative z-10">Join Us</span>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#ff4895] via-[#00ffcc] to-[#ff8866] opacity-70 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute inset-[1px] rounded-full bg-[#13111a] z-0"></div>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}

