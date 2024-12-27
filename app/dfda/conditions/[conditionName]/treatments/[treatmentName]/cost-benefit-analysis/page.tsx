import React from 'react';

import CostBenefitAnalysisReport from "@/app/dfda/components/CostBenefitAnalysisReport";
import { DFDABreadcrumbs } from '@/components/Breadcrumbs/DFDABreadcrumbs';
import { ExtendedMetaAnalysisReport} from "@/lib/agents/fdai/fdaiMetaAnalyzer";

import BackButton from '../../../../../components/BackButton';


// Add type for page props
type PageProps = {
  params: {
    conditionName: string;
    treatmentName: string;
  };
};

// Example report data
const exampleReport: ExtendedMetaAnalysisReport = {
  drugName: "Lisinopril",
  conditionName: "Hypertension",
  overallSafetyRating: "Moderate",
  shortSafetySummary: "Lisinopril is generally well-tolerated but requires monitoring for specific side effects and interactions.",
  keyFindings: [
    "Effective in reducing blood pressure in most patients",
    "May cause dry cough in some patients",
    "Potential for severe allergic reactions in rare cases"
  ],
  riskFactors: [
    "History of angioedema",
    "Kidney disease",
    "Electrolyte imbalances"
  ],
  precautions: [
    "Regular monitoring of kidney function and potassium levels",
    "Avoid use during pregnancy",
    "Use with caution in patients with severe heart failure"
  ],
  contraindications: [
    "History of angioedema related to ACE inhibitor use",
    "Hereditary or idiopathic angioedema",
    "Concomitant use with aliskiren in patients with diabetes"
  ],
  longTermSafetyConsiderations: "Long-term use of Lisinopril is generally considered safe, but ongoing monitoring of kidney function and potassium levels is recommended.",
  pregnancySafety: "Contraindicated during pregnancy due to risk of fetal harm, especially in the second and third trimesters.",
  childrenSafety: "Safety and effectiveness in pediatric patients under 6 years of age have not been established.",
  drugInteractions: [
    {
      drug: "NSAIDs",
      interaction: "May reduce the antihypertensive effect of Lisinopril",
      severity: "Moderate"
    },
    {
      drug: "Potassium supplements",
      interaction: "May increase the risk of hyperkalemia",
      severity: "Moderate"
    },
    {
      drug: "Lithium",
      interaction: "May increase serum lithium levels and lithium toxicity",
      severity: "High"
    }
  ],
  sideEffects: [
    {
      effect: "Dry cough",
      frequency: "Common (up to 20% of patients)",
      severity: "Mild to moderate"
    },
    {
      effect: "Dizziness",
      frequency: "Common (up to 12% of patients)",
      severity: "Mild"
    },
    {
      effect: "Hyperkalemia",
      frequency: "Uncommon (1-2% of patients)",
      severity: "Potentially severe"
    },
    {
      effect: "Angioedema",
      frequency: "Rare (0.1-0.2% of patients)",
      severity: "Severe"
    }
  ],
  relativeSafetyScore: 2,
  effectivenessComparison: [
    {
      intervention: "Amlodipine (calcium channel blocker)",
      relativeEffectiveness: "Similar effectiveness in blood pressure reduction",
      dalysAvoided: 0.15,
      qalysIncreased: 0.2,
      numberNeededToHarm: 50,
      numberNeededToTreat: 20
    },
    {
      intervention: "Lifestyle modifications alone",
      relativeEffectiveness: "More effective than lifestyle modifications alone",
      dalysAvoided: 0.3,
      qalysIncreased: 0.4,
      numberNeededToHarm: 100,
      numberNeededToTreat: 15
    }
  ],
  dalysAvoided: 0.25,
  qalysIncreased: 0.35,
  numberNeededToHarm: 75,
  numberOfPatients: 50000000,
  numberNeededToTreat: 18,
  referenceSources: [
    {
      id: "1",
      title: "Article 1",
      author: "Author 1",
      publishedDate: "2024-01-01",
      text: "This is the text of article 1",
      url: "https://example.com/article1",
      score: 8.5
    }
  ]
};

// Update the component to receive and use params
const CostBenefitAnalysisPage = ({ params }: PageProps) => {
  const { conditionName, treatmentName } = params;
  
  if (!conditionName || !treatmentName) {
    throw new Error('Missing required route parameters');
  }
  return (
    <div className="container mx-auto p-4">
      <DFDABreadcrumbs dynamicValues={{ 
        conditionName,
        treatmentName
      }} />
      <BackButton />
      <CostBenefitAnalysisReport report={exampleReport} />
    </div>
  );
};

export default CostBenefitAnalysisPage;