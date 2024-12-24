import Link from 'next/link'
import { Twitter, Linkedin, Instagram, DiscIcon as Discord } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function Footer() {
  return (
    <footer className="bg-[#13111a] pt-24 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          {/* Links Column */}
          <div className="space-y-8">
            <h3 className="text-white font-bold text-lg">Links</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <Link href="/" className="block text-neutral-400 hover:text-white transition-colors">
                  Home
                </Link>
                <Link href="/lite-paper" className="block text-neutral-400 hover:text-white transition-colors">
                  Lite Paper
                </Link>
                <Link href="/health-references" className="block text-neutral-400 hover:text-white transition-colors">
                  Health References
                </Link>
                <Link href="/api-docs" className="block text-neutral-400 hover:text-white transition-colors">
                  API Docs
                </Link>
                <Link href="/studies" className="block text-neutral-400 hover:text-white transition-colors">
                  Studies
                </Link>
                <Link href="/discord" className="block text-neutral-400 hover:text-white transition-colors">
                  Discord
                </Link>
                <Link href="/wiki" className="block text-neutral-400 hover:text-white transition-colors">
                  Wiki
                </Link>
                <Link href="/dework-bounties" className="block text-neutral-400 hover:text-white transition-colors">
                  Dework Bounties
                </Link>
              </div>
              <div className="space-y-4">
                <Link href="/privacy" className="block text-neutral-400 hover:text-white transition-colors">
                  Privacy
                </Link>
                <Link href="/contributors" className="block text-neutral-400 hover:text-white transition-colors">
                  Contributors
                </Link>
                <Link href="/collaborate-with-us" className="block text-neutral-400 hover:text-white transition-colors">
                  Collaborate with Us
                </Link>
                <Link href="/bug-reports" className="block text-neutral-400 hover:text-white transition-colors">
                  Bug Reports
                </Link>
                <Link href="/feedback" className="block text-neutral-400 hover:text-white transition-colors">
                  Feedback
                </Link>
                <Link href="/calendar" className="block text-neutral-400 hover:text-white transition-colors">
                  Calendar
                </Link>
                <Link href="/gnosis-safe" className="block text-neutral-400 hover:text-white transition-colors">
                  Gnosis Safe
                </Link>
                <Link href="/aragon-dao" className="block text-neutral-400 hover:text-white transition-colors">
                  Aragon DAO
                </Link>
              </div>
            </div>
          </div>

          {/* GitHub Projects Column */}
          <div className="space-y-8">
            <h3 className="text-white font-bold text-lg">GitHub Projects</h3>
            <div className="space-y-4">
              <Link href="/reference-databases" className="block text-neutral-400 hover:text-white transition-colors">
                Reference Databases
              </Link>
              <Link href="/reference-browser" className="block text-neutral-400 hover:text-white transition-colors">
                Reference Browser
              </Link>
              <Link href="/unified-health-api" className="block text-neutral-400 hover:text-white transition-colors">
                Unified Health API
              </Link>
              <Link href="/demo-app" className="block text-neutral-400 hover:text-white transition-colors">
                Demo App
              </Link>
            </div>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-8">
            <h3 className="text-white font-bold text-lg">Subscribe to our newsletter</h3>
            <p className="text-neutral-400">
              Stay up to date on the project and find out about new opportunities to reduce suffering.
            </p>
            <div className="flex gap-2">
              <Input 
                type="email" 
                placeholder="Your email address"
                className="bg-white/5 border-white/10 text-white"
              />
              <Button 
                className="bg-gradient-to-r from-[#ff4895] to-[#00ffcc] text-white hover:opacity-90"
              >
                Subscribe
              </Button>
            </div>
            <div className="flex gap-4">
              <Link href="#" className="text-neutral-400 hover:text-[#ff4895] transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-neutral-400 hover:text-[#ff4895] transition-colors">
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-neutral-400 hover:text-[#ff4895] transition-colors">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-neutral-400 hover:text-[#ff4895] transition-colors">
                <Discord className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <Link href="/" className="text-white font-bold text-xl">
            CureDAO
          </Link>
          <div className="text-neutral-400">
            Copyright © 2022 CureDAO
          </div>
        </div>
      </div>
    </footer>
  )
}

