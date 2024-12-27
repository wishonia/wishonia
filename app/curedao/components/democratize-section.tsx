export function DemocratizeSection() {
  return (
    <section className="py-24 bg-[#13111a]">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          We're on a mission to <br />
          <span className="text-color-gradient-rainbow-accent">
            democratize clinical research</span>
        </h2>
        <p className="max-w-3xl mx-auto text-neutral-400 mb-12 text-lg leading-relaxed">
          There are thousands of unpatentable treatments and dietary factors that would never have sufficient profit incentive to cover the $1 billion cost of research. Through our data aggregation and analysis platform, we've driven down the cost to make it possible to quantify the effects of countless factors on symptom severity.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="card about-hero-achievement bg-[#1d1a27] rounded-xl p-6 transform transition-transform hover:scale-105">
            <div className="card-about-hero-achievement-wrapper">
              <div className="number-big text-4xl font-bold">
                12M<span className="text-[#0088ff]">+</span>
              </div>
              <div className="text-neutral-400 mt-2">Data Points</div>
            </div>
          </div>
          
          <div className="card about-hero-achievement bg-[#1d1a27] rounded-xl p-6 transform transition-transform hover:scale-105">
            <div className="card-about-hero-achievement-wrapper">
              <div className="number-big text-4xl font-bold">
                10K<span className="text-[#ff4895]">+</span>
              </div>
              <div className="text-neutral-400 mt-2">Study participants</div>
            </div>
          </div>
          
          <div className="card about-hero-achievement bg-[#1d1a27] rounded-xl p-6 transform transition-transform hover:scale-105">
            <div className="card-about-hero-achievement-wrapper">
              <div className="number-big text-4xl font-bold">
                90K<span className="text-[#00ffcc]">+</span>
              </div>
              <div className="text-neutral-400 mt-2">Studies</div>
            </div>
          </div>
          
          <div className="card about-hero-achievement bg-[#1d1a27] rounded-xl p-6 transform transition-transform hover:scale-105">
            <div className="card-about-hero-achievement-wrapper">
              <div className="number-big text-4xl font-bold">
                75<span className="text-[#1766ff]">+</span>
              </div>
              <div className="text-neutral-400 mt-2">Partners</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

