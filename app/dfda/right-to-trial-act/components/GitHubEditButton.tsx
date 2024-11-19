'use client'

import { FaGithub } from 'react-icons/fa'

export function GitHubEditButton() {
  return (
    <a
      href="https://github.com/wishonia/wishonia/edit/main/content/globalSolutions/dfda/right-to-trial-act-1.md"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-6 py-3 text-lg font-bold
                 bg-[#f0ebea] text-black rounded-none
                 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                 hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none
                 transition-all duration-200
                 focus:outline-none"
    >
      <FaGithub className="text-2xl" />
      <span className="font-mono uppercase tracking-wider">
        Make Improvements
      </span>
    </a>
  )
}