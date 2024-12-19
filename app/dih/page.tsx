import { Button } from "@/components/ui/button"
import Link from "next/link"
import {ArrowRight, LineChart, LucideIcon, Users} from "lucide-react"
import { Building2 } from "lucide-react"

const features = [
  {
    icon: Building2,
    title: "Decentralized FDA",
    description: "Reimagining drug approval through data integration and cost reduction strategies."
  },
  {
    icon: Users,
    title: "Medical Freedom",
    description: "Empowering patients with universal trial participation and data ownership."
  },
  {
    icon: LineChart,
    title: "Optimal Incentives",
    description: "Implementing the 50/50 health savings program for systemic cost reduction."
  }
]

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
}

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
      <div className="flex flex-col items-center text-center p-6">
        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
  )
}
export default function Home() {
  return (
      <div className="flex flex-col min-h-screen">
        <section className="py-20 px-4 text-center bg-gradient-to-b from-background to-secondary">
          <div className="container mx-auto max-w-4xl">
            <Building2 className="mx-auto h-16 w-16 mb-8"/>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Decentralized Institutes of Health
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Accelerating the end of disease through decentralized governance, universal medical freedom, and aligned
              incentives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/dfda/cure-acceleration-act">
                  View Blueprint <ArrowRight className="ml-2 h-4 w-4"/>
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature) => (
                  <FeatureCard key={feature.title} {...feature} />
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4 bg-secondary">
          <div className="container mx-auto text-center max-w-3xl">
            <h2 className="text-3xl font-bold mb-4">Join the Movement</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Be part of the global initiative to transform healthcare through decentralized governance and data-driven
              solutions.
            </p>
            <Button asChild size="lg">
              <Link href="/dfda/cure-acceleration-act">Get Involved</Link>
            </Button>
          </div>
        </section>

      </div>
  )
}