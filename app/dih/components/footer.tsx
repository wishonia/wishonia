import { Building2 } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/dih/" className="flex items-center space-x-2">
              <Building2 className="h-6 w-6" />
              <span className="font-bold">dIH</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Accelerating the end of disease through decentralized governance, universal medical freedom, and aligned incentives.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/dfda/docs/cure-acceleration-act" className="text-sm text-muted-foreground hover:text-foreground">Blueprint</Link></li>
              <li><Link href="/dfda" className="text-sm text-muted-foreground hover:text-foreground">Data Hub</Link></li>
              <li><Link href="/dfda/trials" className="text-sm text-muted-foreground hover:text-foreground">Clinical Trials</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="/dih/governance" className="text-sm text-muted-foreground hover:text-foreground">Governance</Link></li>
              <li><Link href="/dih/partnerships" className="text-sm text-muted-foreground hover:text-foreground">Partnerships</Link></li>
              <li><Link href="/dih/news" className="text-sm text-muted-foreground hover:text-foreground">News & Updates</Link></li>
              <li><Link href="/dih/contact" className="text-sm text-muted-foreground hover:text-foreground">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Connect</h3>
            <ul className="space-y-2">
              <li><Link href="/dih/contact" className="text-sm text-muted-foreground hover:text-foreground">Get Involved</Link></li>
              <li><Link href="/dih/donate" className="text-sm text-muted-foreground hover:text-foreground">Support Our Mission</Link></li>
              <li><Link href="/dih/newsletter" className="text-sm text-muted-foreground hover:text-foreground">Newsletter</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Decentralized Institutes of Health. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}