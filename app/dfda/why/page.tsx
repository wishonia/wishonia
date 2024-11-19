import WhyHero from './components/WhyHero'
import HistoricalEvidence from './components/HistoricalEvidence'
import WhySolution from './components/WhySolution'

export default function WhyPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <h1 className="text-5xl font-black mb-8">Why We Need a Decentralized FDA</h1>
      <WhyHero />
      <HistoricalEvidence />
      <WhySolution />
    </div>
  )
} 