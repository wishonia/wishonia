import { Phone, TrendingUp } from 'lucide-react'
import Image from 'next/image'

export function FailedInnovationSection() {
  return (
    <section className="container mx-auto px-6 py-24">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Digital Health Innovation Has Failed
          </h2>
          <p className="text-neutral-400 text-lg">
            The last 10 years have seen an explosion in the amount of health data and innovation. This has the promise to revolutionize human health and well-being. However, so far they've produced no measurable gains in the costs of disease or human lifespan.
          </p>
          
          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center">
                <Phone className="w-6 h-6 text-[#00ffcc]" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">350,000 Health Apps</h3>
                <p className="text-neutral-400">
                  Most health apps have significant overlap in functionality. This represents a cost of $157,500,000,000 on duplication of effort.
                </p>
              </div>
            </div>
            
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#00ffcc]" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">50X Explosion in Health Data</h3>
                <p className="text-neutral-400">
                  The problem is that all this data is dispersed. In isolation, it can only provide dashboards with "descriptive" statistics about what you've done. We need "prescriptive" solutions, telling us what we should do to alleviate or prevent disease.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#ff4895] via-[#6e4fe9] to-[#00ffcc] rounded-3xl opacity-30 blur-xl"></div>
          <div className="relative bg-[#1d1a27] rounded-3xl p-8 border border-white/10">
            <div className="">
              <div className="aspect-[4/4] w-full relative">
                <Image
                  src="/globalSolutions/dfda/img/life-expectancy-cost-chart.jpg"
                  alt="Graph showing declining life expectancy and increasing healthcare costs from 2000 to 2017"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

