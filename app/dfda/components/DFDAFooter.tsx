"use client"

import Link from "next/link"
import { NavItem } from "@/types"

interface DFDAFooterProps {
  navItems?: NavItem[]
}

export default function DFDAFooter({ navItems = [] }: DFDAFooterProps) {
  return (
    <footer className="mt-12 rounded-xl border-4 border-black bg-white p-4 text-center font-bold shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <div className="mb-4">
        <ul className="flex flex-wrap justify-center gap-4">
          {navItems.map((item, index) => (
            <li key={index}>
              {item.external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {item.title}
                </a>
              ) : (
                <Link href={item.href} className="hover:underline">
                  {item.title}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
      <p>
        &copy; 2023 dFDA - Accelerating discovery to minimize suffering in the
        universe! 🚀
      </p>
    </footer>
  )
}