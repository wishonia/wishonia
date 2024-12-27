import Link from 'next/link'

export function HeroBanner() {
  return (
    <div className="relative flex justify-center mb-16">
      <div className="relative group">
        <Link 
          href="/join-us" 
          className="relative z-10 flex items-center gap-4 bg-black border border-white/10 rounded-full px-8 py-3 hover:bg-black/90 transition-all duration-300"
        >
          <span className="text-neutral-200 text-sm">
            WANT TO ACCELERATE RESEARCH?
          </span>
          <span className="text-white text-sm font-semibold flex items-center gap-2">
            Join Us!
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </Link>
        <div className="home-hero-featured-message-blur" />
      </div>
    </div>
  )
}

