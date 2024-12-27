import TreatmentConditionSearchBox from '../components/TreatmentConditionReviewsSearchBox'
import AdvancedTrialSearch from '../trials/components/AdvancedTrialSearch'

import VariableSearchSection from './components/VariableSearchSection'

export const metadata = {
  title: 'Search | dFDA',
  description: 'Search treatments, conditions, clinical trials, foods and supplements to find what works best for your health.',
  keywords: [
    'clinical trials',
    'medical treatments',
    'health conditions',
    'supplements',
    'food database',
    'medical research',
    'health search'
  ],
  openGraph: {
    title: 'Search Everything | dFDA',
    description: 'Find treatments, clinical trials, and health data to improve your wellbeing.',
    type: 'website'
  }
}

export default function SearchPage() {
  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      <h1 className="neobrutalist-hero-title">Search Everything 🔍</h1>

      {/* Treatments & Conditions */}
      <div className="neobrutalist-gradient-container neobrutalist-gradient-pink">
        <h2 className="neobrutalist-title">Treatments & Conditions 💊</h2>
        <TreatmentConditionSearchBox />
      </div>

      {/* Clinical Trials */}
      <div className="neobrutalist-container">
        <h2 className="neobrutalist-title">Clinical Trials 🔬</h2>
        <AdvancedTrialSearch />
      </div>

      {/* Foods & Supplements */}
      <VariableSearchSection />
    </div>
  )
}