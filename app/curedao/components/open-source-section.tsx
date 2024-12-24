import { Lock, Rocket } from 'lucide-react'

export function OpenSourceSection() {
  return (
    <section className="container mx-auto px-6 py-24">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#ff4895] via-[#6e4fe9] to-[#00ffcc] rounded-3xl opacity-30 blur-xl"></div>
          <div className="relative bg-[#1d1a27] rounded-3xl p-8 border border-white/10">
            <div className="grid grid-cols-10 gap-2 aspect-square p-4">
              {/* Vertical green asterisks */}
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={`v-${i}`} className="w-full aspect-square bg-[#00ffcc] rounded-md"></div>
              ))}
              
              {/* Horizontal red asterisks */}
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={`h-${i}`} className="w-full aspect-square bg-[#ff4895] rounded-md"></div>
              ))}
              
              {/* Corner green asterisk */}
              <div className="w-full aspect-square bg-[#00ffcc] rounded-md"></div>
              
              {/* Labels */}
              <div className="absolute top-4 left-4 text-white font-bold">
                Open-Source Vertical<br />Innovation
              </div>
              <div className="absolute bottom-16 left-4 text-white font-bold">
                Closed-Source<br />Duplication of Effort
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Incentivizing Open-Source Collaboration to Accelerate Innovation
          </h2>
          <p className="text-neutral-400 text-lg">
            WordPress is a great example of how tens of thousands of independent plugin developers benefit from using and contributing to a shared core open-source platform.
          </p>
          
          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center">
                <Lock className="w-6 h-6 text-[#ff4895]" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Closed-Source Horizontal Stagnation</h3>
                <p className="text-neutral-400">
                  It's hard to make any progress when we're paying over 350,000 programmers to build the exact same basic functionalities.
                </p>
              </div>
            </div>
            
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center">
                <Rocket className="w-6 h-6 text-[#00ffcc]" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Open-Source Vertical Innovation</h3>
                <p className="text-neutral-400">
                  By standing on each other's shoulders instead of duplicating work, we can potentially increase the rate of progress by 350,000 times.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

