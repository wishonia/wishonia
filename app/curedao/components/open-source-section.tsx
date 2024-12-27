import { Lock, Rocket } from 'lucide-react'
import Image from 'next/image'

export function OpenSourceSection() {
  return (
    <section className="container mx-auto px-6 py-24">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="relative">
          <Image
            src="/globalSolutions/dfda/img/vertical-innovation.jpg"
            alt="Vertical Innovation"
            width={500}
            height={500}
            className="w-full h-auto"
            />
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

