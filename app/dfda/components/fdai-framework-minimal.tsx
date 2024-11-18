import React from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Smartphone, FileText, FlaskRoundIcon as Flask, Cloud, ShoppingCart, Database, Shield, Brain, Users, BarChart, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function FDAiFrameworkMinimal() {
  return (
    <div className="">
      <header className="mb-12 border-b-8 border-black pb-6">
        <h1 className="mb-4 text-6xl font-black uppercase tracking-tight">FDAi Framework</h1>
        <p className="text-xl font-bold">Secure, Private, Intelligent Health Data Processing</p>
      </header>

      <main className="mx-auto max-w-5xl space-y-16">
        <section className="space-y-8">
          <h2 className="text-4xl font-black uppercase">Data Silos</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { icon: Smartphone, title: "Wearable Devices" },
              { icon: FileText, title: "Medical Records" },
              { icon: Flask, title: "Labs" },
              { icon: Smartphone, title: "Digital Health Apps" },
              { icon: Cloud, title: "Environment" },
              { icon: ShoppingCart, title: "Purchase Records" }
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-4 border-4 border-black p-4">
                <item.icon className="h-8 w-8 flex-shrink-0" />
                <h3 className="font-bold">{item.title}</h3>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-4xl font-black uppercase">Data Flow</h2>
          <div className="flex flex-col items-center space-y-8">
            {[
              { icon: Database, title: "Instant API Gateway", desc: "Data collection & standardization" },
              { icon: Shield, title: "Digital Twin Safe", desc: "Personal FDA node with encrypted storage" },
              { icon: Brain, title: "Causal Inference", desc: "AI algorithms calculate symptom changes" },
              { icon: Users, title: "Clinipedia", desc: "Anonymous outcome data sharing" },
              { icon: BarChart, title: "Analysis", desc: "Comparative effectiveness aggregation" },
              { icon: Building2, title: "Regulatory Impact", desc: "Inform agencies for safety & effectiveness" }
            ].map((item, index) => (
              <React.Fragment key={index}>
                <div className="w-full border-4 border-black bg-white p-6 text-center">
                  <item.icon className="mx-auto mb-4 h-12 w-12" />
                  <h3 className="mb-2 text-2xl font-black">{item.title}</h3>
                  <p className="font-bold">{item.desc}</p>
                </div>
                {index < 5 && <ArrowRight className="h-12 w-12 rotate-90" />}
              </React.Fragment>
            ))}
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-4xl font-black uppercase">Key Features</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              "Encrypted raw data on user devices",
              "Unidentifiable outcome data sharing",
              "Real-world evidence collection",
              "Rapid safety signal detection",
              "Treatment effectiveness validation",
              "Personalized health insights"
            ].map((feature, index) => (
              <div key={index} className="border-4 border-black p-4 text-center font-bold">
                {feature}
              </div>
            ))}
          </div>
        </section>

        <section className="text-center">
          <Button className="border-4 border-black bg-black p-6 text-2xl font-black text-white transition-all hover:bg-white hover:text-black">
            Learn More About Data Privacy
          </Button>
        </section>
      </main>

      <footer className="mt-16 border-t-8 border-black pt-8 text-center font-bold">
        <Link href="/" className="inline-flex items-center font-black text-black hover:underline">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Home
        </Link>
      </footer>
    </div>
  )
}