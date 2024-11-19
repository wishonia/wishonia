'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, Search } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import SearchBar from './SearchBar'
import DocsSidebar from './DocsSidebar'
import { MenuItem } from '../lib/parseSummary'
import { RepoContent } from '../actions'

interface MobileHeaderProps {
  menu: MenuItem[] | RepoContent[]
}

function isMenuItem(item: MenuItem | RepoContent): item is MenuItem {
  return 'title' in item && !('name' in item)
}

function ensureMenuItems(items: RepoContent[] | MenuItem[]): MenuItem[] {
  return items.map(item => {
    if (isMenuItem(item)) {
      return {
        ...item,
        children: item.children ? ensureMenuItems(item.children) : undefined,
        path: item.path
      }
    }
    // Handle RepoContent type
    return {
      title: item.name,
      path: item.path,
      children: item.children ? ensureMenuItems(item.children) : undefined,
      href: item.path // Include href if it's part of MenuItem interface
    }
  })
}

export default function MobileHeader({ menu }: MobileHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)

  const menuItems = ensureMenuItems(menu)

  return (
    <div className="fixed top-0 left-0 right-0 h-14 border-b border-border bg-background flex items-center justify-between px-4 md:hidden z-50">
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0 pt-14">
          <div className="flex flex-col h-full">
            <DocsSidebar 
              menu={menuItems} 
              onClose={() => setSheetOpen(false)} 
            />
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)}>
            <Search className="h-5 w-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="p-0">
          <SearchBar 
            menu={menuItems} 
            onClose={() => setSearchOpen(false)} 
            mobile 
          />
        </DialogContent>
      </Dialog>
    </div>
  )
} 