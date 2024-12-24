import { Phone, TrendingUp } from 'lucide-react'

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
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="text-[#ff4895] text-xl font-semibold">Life Expectancy</div>
                  <div className="text-neutral-400">is Declining</div>
                </div>
                <div className="space-y-1 text-right">
                  <div className="text-[#00ffcc] text-xl font-semibold">Costs are</div>
                  <div className="text-[#00ffcc]">Actually Increasing</div>
                </div>
              </div>
              
              <div className="aspect-[4/3] w-full relative">
                <svg className="w-full h-full" viewBox="0 0 400 300">
                  {/* Y-axis labels */}
                  <text x="10" y="40" className="fill-neutral-400 text-xs">$8,500</text>
                  <text x="10" y="280" className="fill-neutral-400 text-xs">$3,500</text>
                  
                  {/* Right Y-axis labels */}
                  <text x="370" y="40" className="fill-neutral-400 text-xs">79.5</text>
                  <text x="370" y="280" className="fill-neutral-400 text-xs">76.5</text>
                  
                  {/* Life expectancy line (red) */}
                  <path
                    d="M50,150 Q200,100 350,180"
                    fill="none"
                    stroke="#ff4895"
                    strokeWidth="3"
                  />
                  
                  {/* Cost line (green) */}
                  <path
                    d="M50,250 Q200,150 350,50"
                    fill="none"
                    stroke="#00ffcc"
                    strokeWidth="3"
                  />
                  
                  {/* X-axis labels */}
                  <text x="50" y="295" className="fill-neutral-400 text-xs">2000</text>
                  <text x="350" y="295" className="fill-neutral-400 text-xs">2017</text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

