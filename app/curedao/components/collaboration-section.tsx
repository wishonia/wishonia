import { Building2, Brain, Coins, FileKey, Heart, LandPlot } from 'lucide-react'

export function CollaborationSection() {
  return (
    <section className="py-24 bg-[#13111a]">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            How Collaborationism Makes{' '}
            <span className="text-color-gradient-rainbow-accent">
              Everyone Better Off
            </span>
          </h2>
          <p className="text-neutral-400">
            CureDAO is transcending the zero-sum game of previous economic models to reward cooperation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[#1d1a27] rounded-3xl p-8 border border-white/10">
            <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-6">
              <Coins className="w-6 h-6 text-[#00ffcc]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Platform Contributors</h3>
            <p className="text-neutral-400">
              By contributing to the success of CureDAO, you'll enjoy ongoing royalties in proportion to your contributions.
            </p>
          </div>

          <div className="bg-[#1d1a27] rounded-3xl p-8 border border-white/10">
            <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-6">
              <FileKey className="w-6 h-6 text-[#0088ff]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Data Silo Owners</h3>
            <p className="text-neutral-400">
              By facilitating data sharing, business will enjoy an eventual reduction in their employee healthcare costs (one of their largest expenses) by discovering new, more cost-effective ways to prevent and treat disease.
            </p>
          </div>

          <div className="bg-[#1d1a27] rounded-3xl p-8 border border-white/10">
            <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-6">
              <Brain className="w-6 h-6 text-[#ff4895]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Data Donors</h3>
            <p className="text-neutral-400">
              By anonymously sharing your data, you can receive an ongoing share of the revenue from new treatments discovered. You'll also receive real-time decision support to mitigate and prevent chronic illness.
            </p>
          </div>

          <div className="bg-[#1d1a27] rounded-3xl p-8 border border-white/10">
            <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-6">
              <Heart className="w-6 h-6 text-[#00ffcc]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Digital Health</h3>
            <p className="text-neutral-400">
              Digital Health Businesses can use the platform and reduce software development costs. This allows them to focus on innovating their unique value proposition, making them more competitive in the market.
            </p>
          </div>

          <div className="bg-[#1d1a27] rounded-3xl p-8 border border-white/10">
            <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-6">
              <LandPlot className="w-6 h-6 text-[#0088ff]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Non-Profits</h3>
            <p className="text-neutral-400">
              Disease advocacy non-profits can further their mission by promoting study participation. Additionally, this leads to member engagement more productive than the traditional charity walk.
            </p>
          </div>

          <div className="bg-[#1d1a27] rounded-3xl p-8 border border-white/10">
            <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-6">
              <Building2 className="w-6 h-6 text-[#ff4895]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Government</h3>
            <p className="text-neutral-400">
              We can reduce government healthcare costs due to the discovery of new ways to prevent and mitigate chronic illnesses. All nations contributing to a shared open-source code base would reduce development costs.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

