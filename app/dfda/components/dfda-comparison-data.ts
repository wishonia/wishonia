export interface ComparisonItem {
  category: string
  regularFDA: string
  decentralizedFDA: string
  details: string
}

export const comparisonData: ComparisonItem[] = [
  {
    category: "🎯 Drug Development Success Rate",
    regularFDA: "❌ Only 13.8% success rate",
    decentralizedFDA: "✅ Targeting 3x higher success rate",
    details: `
Current FDA statistics:
- Only 13.8% of all drugs entering clinical trials get approved [Clinical Development Success Rates 2006-2015, BIO Industry Analysis]
- 90% of drugs fail in early clinical trials
- $2.6B average cost per drug development due to failures
- Phase II success rate only 30.7%, Phase III only 58.1%

DFDA improvements:
- AI prediction models to identify promising candidates early
- Continuous monitoring reduces late-stage failures
- Real-time efficacy tracking
- Historical data analysis to predict success
- Estimated 30-40% success rate through better candidate selection`,
  },
  {
    category: "💰 Clinical Research Costs",
    regularFDA: "❌ $2.6B per drug approval",
    decentralizedFDA: "✅ Est. $150M per drug (-95%)",
    details: `
Current costs (per successful drug):
- Total cost: $2.6B (Tufts Center for Drug Development)
- Clinical trials: $1.5B
- Pre-clinical: $1.1B
- Time cost: $1.2B
- Out-of-pocket: $1.4B

Detailed DFDA cost reductions:
- Site costs: -100% ($7.4M → $0)
- Admin overhead: -99% ($7.2M → $50K)
- Patient recruitment: -99% ($805K → $5K)
- Data management: -95% ($198K → $10K)
- Physician costs: -95% ($1.97M → $100K)

Sources:
- DiMasi JA, et al. Innovation in the pharmaceutical industry: New estimates of R&D costs
- Cost-savings-data.ts analysis`,
  },
  {
    category: "⏱️ Drug Approval Timeline",
    regularFDA: "❌ 12+ years average",
    decentralizedFDA: "✅ Target 3-4 years",
    details: `
Current FDA timeline:
- Pre-clinical: 3-6 years
- Phase I: 1-2 years
- Phase II: 2-3 years
- Phase III: 3-4 years
- FDA review: 1-2 years
- Total: 12-15 years average

DFDA timeline reduction through:
- Parallel processing: -40% time
- Real-time data analysis: -30% review time
- Automated recruitment: -60% enrollment time
- Continuous monitoring: -50% trial duration
- AI-powered protocol optimization: -25% setup time

Source: FDA Drug Development Process - Step by Step`,
  },
  {
    category: "📊 Real-World Evidence Usage",
    regularFDA: "❌ <5% of approvals use RWE",
    decentralizedFDA: "✅ 100% RWE integration",
    details: `
Current FDA limitations:
- Only 4.7% of drug approvals use RWE (2016-2019)
- 95% of real-world data unused
- Limited post-market surveillance
- Delayed safety signal detection

DFDA RWE advantages:
- 100% of approvals use RWE
- Continuous monitoring of all approved drugs
- Real-time safety signal detection
- Integration with 100+ health systems
- Machine learning on billions of data points

Source: Analysis of FDA's RWE Framework (2018-2022)`,
  },
  {
    category: "🦠 Rare Disease Development",
    regularFDA: "❌ 95% have no treatment",
    decentralizedFDA: "✅ Accelerated rare disease program",
    details: `
Current situation:
- 7,000+ known rare diseases
- 95% have no FDA-approved treatment
- Average cost: $4B+ for rare disease drug
- Patient population often <1,000
- 50% affect children

DFDA rare disease approach:
- 80% lower development costs
- Global patient matching
- Adaptive trial designs
- Shared control arms
- Biomarker validation
- Historical data usage

Sources:
- NIH Rare Diseases Database
- FDA Orphan Drug Development Program Statistics`,
  },
  {
    category: "👥 Trial Patient Diversity",
    regularFDA: "❌ 75% white participants",
    decentralizedFDA: "✅ Representative demographics",
    details: `
Current FDA trials:
- 75% white participants
- 11% Hispanic participation
- 8% Black participation
- 6% Asian participation
- Geographic limitations
- Income/insurance barriers

DFDA improvements:
- Matches US census demographics
- Remote participation enabled
- No geographic barriers
- Income-neutral access
- Multi-language support
- Cultural competency

Source: FDA Drug Trials Snapshots Summary Report`,
  },
  {
    category: "🔒 Data Privacy & Security",
    regularFDA: "❌ 4,500 breaches since 2009",
    decentralizedFDA: "✅ Zero-knowledge architecture",
    details: `
Current system issues:
- 4,500+ healthcare data breaches since 2009
- 300M+ patients affected
- Average breach cost: $9.2M
- Centralized vulnerability
- Limited audit trails

DFDA security features:
- Zero-knowledge proofs
- Homomorphic encryption
- Distributed storage
- Quantum-resistant encryption
- Immutable audit logs
- Patient-controlled sharing

Sources:
- HHS Healthcare Data Breaches Portal
- IBM Cost of Data Breach Report 2023`,
  },
  {
    category: "📖 Publication Bias",
    regularFDA: "❌ 50% of trials unpublished",
    decentralizedFDA: "✅ 100% results transparency",
    details: `
Current problems:
- 50% of clinical trials never published
- 68% of negative results unpublished
- Average delay: 2 years to publication
- Selective outcome reporting
- Missing adverse events

DFDA solutions:
- Real-time results posting
- Automated trial registration
- Mandatory outcome reporting
- Public access to all data
- Standardized reporting
- Negative result repository

Sources:
- AllTrials Initiative Statistics
- WHO Clinical Trials Registry Platform`,
  },
]
