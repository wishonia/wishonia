import { Metadata } from "next"





export const metadata: Metadata = {
  title: "Health Savings Sharing | Right to Trial Act",
  description:
    "A new way to encourage life-saving cures by sharing healthcare savings with innovators",
}

export default function HealthSavingsSharing() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">
        A New Way to Encourage Life-Saving Cures: Sharing Healthcare Savings
        with Innovators
      </h1>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold">
          The Problem: High Costs of Chronic Diseases
        </h2>
        <div className="prose max-w-none">
          <h3 className="mb-3 text-xl font-medium">What's Happening Now?</h3>
          <div className="space-y-6">
            <div>
              <h4 className="font-medium">
                Chronic Diseases Are Widespread and Expensive
              </h4>
              <p className="mb-2">
                Examples: Heart disease, cancer, diabetes, Alzheimer's, and
                other age-related conditions.
              </p>
              <p className="mb-2">
                High Lifetime Costs: Treating these diseases over a person's
                lifetime can cost hundreds of thousands to millions of dollars
                per patient.
              </p>
              <ul className="list-disc pl-6">
                <li>Heart Disease: ~$750,000 per patient</li>
                <li>Cancer: ~$150,000 per patient</li>
                <li>Alzheimer's Disease: ~$350,000 per patient</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium">Financial Strain on Everyone</h4>
              <ul className="list-disc pl-6">
                <li>
                  Patients and Families: Face ongoing medical bills and reduced
                  quality of life
                </li>
                <li>
                  Healthcare Systems: Spend vast resources managing chronic
                  conditions
                </li>
                <li>
                  Society: Loses productivity due to illness and caregiving
                  burdens
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium">Current Incentives Aren't Aligned</h4>
              <ul className="list-disc pl-6">
                <li>
                  Pharmaceutical Companies: Often focus on treatments that
                  manage symptoms over the long term because they provide steady
                  revenue
                </li>
                <li>
                  Lack of Motivation for Cures: Developing a one-time cure is
                  less financially attractive under the current model
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold">
          The Solution: Incentivize Cures Through Shared Healthcare Savings
        </h2>
        <div className="prose max-w-none">
          <h3 className="mb-3 text-xl font-medium">Your Innovative Plan</h3>
          <ul className="list-disc pl-6">
            <li>
              Share Savings with Developers: Guarantee companies 50% of the
              average healthcare savings per patient who uses their treatment
            </li>
            <li>
              Make Treatments Accessible: Companies offer these therapies at low
              or no upfront cost to patients
            </li>
            <li>
              Align Interests: Companies profit by reducing overall healthcare
              costs
            </li>
          </ul>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold">
          How It Works: A Step-by-Step Explanation
        </h2>
        <div className="prose max-w-none space-y-6">
          {[
            {
              title: "1. Develop Cures or Preventative Treatments",
              content:
                "Pharmaceutical Innovation: Companies invest in research and development to create therapies that can cure diseases or prevent them from occurring.",
            },
            {
              title: "2. Calculate Average Healthcare Savings",
              content:
                "Determine Lifetime Treatment Costs: Estimate the average cost of treating a disease over a patient's lifetime. Example: If managing diabetes costs $200,000 per patient over their lifetime.",
            },
            {
              title: "3. Establish a Savings-Sharing Agreement",
              content:
                "Agree on Profit-Sharing: Companies and healthcare payers agree that the company will receive 50% of the savings for each patient treated.",
            },
            {
              title: "4. Price the Therapy Low or Free",
              content:
                "Maximize Accessibility: Companies offer the therapy at little to no cost upfront to patients to remove financial barriers.",
            },
            {
              title: "5. Treat as Many Patients as Possible",
              content:
                "Widespread Adoption: With affordable access, more patients receive the therapy and improve their health.",
            },
            {
              title: "6. Share the Healthcare Savings",
              content:
                "Healthcare System Saves Money: Avoids high costs of long-term disease management while companies receive their share of the savings.",
            },
          ].map((step) => (
            <div key={step.title}>
              <h3 className="mb-2 text-xl font-medium">{step.title}</h3>
              <p>{step.content}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold">
          The Benefits: Why This Plan Is Great for Everyone
        </h2>
        <div className="prose max-w-none space-y-6">
          {[
            {
              title: "For Patients",
              items: [
                "Affordable Access to Cures: No high upfront costs",
                "Reduced Financial Burden: Eliminates ongoing expenses",
                "Better Quality of Life: Being cured leads to healthier lives",
                "Less Suffering: Avoids complications of chronic illnesses",
              ],
            },
            {
              title: "For Healthcare Systems and Insurers",
              items: [
                "Significant Cost Savings: Reduced long-term expenses",
                "Resource Reallocation: Funds saved for other critical areas",
                "Improved Efficiency: Simplified care management",
                "Better Outcomes: Overall health improvements",
              ],
            },
            {
              title: "For Pharmaceutical Companies",
              items: [
                "Strong Financial Incentives: Profitable returns",
                "Scalable Earnings: Higher profits with more patients",
                "Encouraged Innovation: Focus on developing cures",
                "Positive Public Image: Enhanced reputation",
              ],
            },
            {
              title: "For Society",
              items: [
                "Healthier Population: Increased productivity",
                "Economic Growth: Lower healthcare costs",
                "More Resources Available: Savings for other needs",
                "Greater Health Equity: Access for all",
              ],
            },
          ].map((benefit) => (
            <div key={benefit.title}>
              <h3 className="mb-2 text-xl font-medium">{benefit.title}</h3>
              <ul className="list-disc pl-6">
                {benefit.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Example Impact Section */}
      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold">
          Visualizing the Impact: An Example
        </h2>
        <div className="prose max-w-none">
          <h3 className="mb-3 text-xl font-medium">
            Scenario: A Cure for Type 2 Diabetes
          </h3>
          <ul className="mb-4 list-disc pl-6">
            <li>Average Lifetime Treatment Cost per Patient: $200,000</li>
            <li>Developer's Share per Patient: $100,000 (50% of savings)</li>
            <li>Number of Patients Treated: 1 million</li>
          </ul>

          <h4 className="mb-2 font-medium">Financial Outcomes</h4>
          <ul className="mb-4 list-disc pl-6">
            <li>Total Healthcare Savings: $200 billion</li>
            <li>Company's Earnings: $100 billion</li>
            <li>Healthcare System Savings: $100 billion</li>
          </ul>
        </div>
      </section>

      {/* Call to Action */}
      <section className="mt-12 rounded-lg bg-blue-50 p-6">
        <h2 className="mb-4 text-2xl font-semibold">
          Final Thought: A Call to Action
        </h2>
        <div className="prose max-w-none">
          <p className="mb-4 font-medium">
            Let's Work Together to Make This Vision a Reality
          </p>
          <ul className="list-disc pl-6">
            <li>
              Support Innovation: Encourage and invest in research for cures
            </li>
            <li>Promote Collaboration: Unite stakeholders across healthcare</li>
            <li>Drive Policy Change: Advocate for supportive legislation</li>
            <li>Champion Access: Ensure treatments are accessible to all</li>
          </ul>
          <p className="mt-4 font-medium">
            Together, we can revolutionize healthcare, shifting the focus from
            managing diseases to curing them, and from short-term profits to
            long-term well-being for all.
          </p>
        </div>
      </section>
    </article>
  )
}
