import { CostItem } from '@/app/dfda/cost-savings'

export const clinicalTrialCostData: CostItem[] = [
  {
    name: "Data Management Costs",
    currentCost: 198014,
    currentExplanation: "Costs for data collection, storage, cleaning, and analysis",
    newCost: 10000,
    reductionExplanation: "Automated data collection and AI-driven analysis",
    remainingExplanation: "Minimal costs for system maintenance and updates",
    emoji: "💾"
  },
  {
    name: "Cost Per IRB Approvals",
    currentCost: 324081,
    currentExplanation: "Fees for ethical review board submissions and approvals",
    newCost: 5000,
    reductionExplanation: "AI-generated protocols with built-in ethical considerations",
    remainingExplanation: "Small fee for regulatory body to review AI system",
    emoji: "✅"
  },
  {
    name: "Cost of IRB Amendments",
    currentCost: 6347,
    currentExplanation: "Costs for submitting and reviewing protocol changes",
    newCost: 0,
    reductionExplanation: "AI dynamically adjusts protocols within predefined ethical boundaries",
    remainingExplanation: "No amendments needed",
    emoji: "📝"
  },
  {
    name: "SDV Costs",
    currentCost: 1486250,
    currentExplanation: "Expenses for verifying source data against reported data",
    newCost: 0,
    reductionExplanation: "Blockchain-like technology ensures data integrity",
    remainingExplanation: "No verification needed",
    emoji: "🔍"
  },
  {
    name: "Patient Recruitment Costs",
    currentCost: 805785,
    currentExplanation: "Advertising, screening, and enrollment expenses",
    newCost: 5000,
    reductionExplanation: "Automated matching of patients to trials via EHR integration",
    remainingExplanation: "Minimal costs for system operation",
    emoji: "🤝"
  },
  {
    name: "Patient Retention Costs",
    currentCost: 76879,
    currentExplanation: "Costs to keep patients engaged in the trial",
    newCost: 20000,
    reductionExplanation: "Automated reminders and digital engagement tools",
    remainingExplanation: "Costs for app maintenance and digital incentives",
    emoji: "🎯"
  },
  {
    name: "RN/CRA Costs",
    currentCost: 2379605,
    currentExplanation: "Salaries for nurses and clinical research associates",
    newCost: 50000,
    reductionExplanation: "Mostly automated, with minimal human oversight",
    remainingExplanation: "Salary for a small team to handle exceptions",
    emoji: "👨‍⚕️"
  },
  {
    name: "Physician Costs",
    currentCost: 1966621,
    currentExplanation: "Fees for doctors overseeing the trial",
    newCost: 100000,
    reductionExplanation: "AI interprets most data, physicians review complex cases",
    remainingExplanation: "Reduced physician time for oversight",
    emoji: "👩‍⚕️"
  },
  {
    name: "Clinical Procedure Total",
    currentCost: 5937819,
    currentExplanation: "Costs for all clinical procedures performed during the trial",
    newCost: 1000000,
    reductionExplanation: "Leveraging existing healthcare infrastructure, automated scheduling",
    remainingExplanation: "Costs for necessary in-person procedures",
    emoji: "🏥"
  },
  {
    name: "Laboratory Costs",
    currentCost: 2325922,
    currentExplanation: "Expenses for all lab tests and analysis",
    newCost: 500000,
    reductionExplanation: "Use of local labs, automated result reporting",
    remainingExplanation: "Costs for actual lab tests and equipment",
    emoji: "🧪"
  },
  {
    name: "Site Recruitment Costs",
    currentCost: 849158,
    currentExplanation: "Expenses to identify and set up trial sites",
    newCost: 0,
    reductionExplanation: "No traditional sites needed in decentralized model",
    remainingExplanation: "N/A",
    emoji: "🏢"
  },
  {
    name: "Site Retention Costs",
    currentCost: 4461322,
    currentExplanation: "Ongoing costs to keep sites operational",
    newCost: 0,
    reductionExplanation: "No traditional sites to retain",
    remainingExplanation: "N/A",
    emoji: "🏗️"
  },
  {
    name: "Administrative Staff Costs",
    currentCost: 7229968,
    currentExplanation: "Salaries for staff managing trial operations",
    newCost: 50000,
    reductionExplanation: "AI-driven administrative tasks",
    remainingExplanation: "Minimal human oversight needed",
    emoji: "👥"
  },
  {
    name: "Site Monitoring Costs",
    currentCost: 4456717,
    currentExplanation: "Expenses for overseeing trial sites",
    newCost: 0,
    reductionExplanation: "Automated data monitoring, no physical sites",
    remainingExplanation: "N/A",
    emoji: "📊"
  },
  {
    name: "Site Overhead",
    currentCost: 7386816,
    currentExplanation: "General operational costs for trial sites",
    newCost: 0,
    reductionExplanation: "No physical sites required",
    remainingExplanation: "N/A",
    emoji: "🏢"
  },
  {
    name: "All Other Costs",
    currentCost: 17096703,
    currentExplanation: "Miscellaneous expenses not captured elsewhere",
    newCost: 100000,
    reductionExplanation: "Drastically reduced miscellaneous costs",
    remainingExplanation: "Unforeseen expenses and contingencies",
    emoji: "📎"
  }
]

export const TOTAL_CURRENT_COST = clinicalTrialCostData.reduce((acc, item) => acc + item.currentCost, 0)
export const TOTAL_NEW_COST = clinicalTrialCostData.reduce((acc, item) => acc + item.newCost, 0)