"use client"

import { NeoBrutalModalLayout } from "@/components/layouts/NeoBrutalModalLayout"

export function DFDADisclaimerModal({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <NeoBrutalModalLayout
      title="⚠️ This is the Decentralized FDA (dFDA) is not affiliated with the FDA."
      text="We're working to create a prototype of the platonic ideal of what the FDA could be through data-driven automation
            and decentralized research"
      content={
        <div className="space-y-2">
          <p>
            Our mission is to accelerate medical progress while maintaining the
            highest standards of safety and efficacy.
          </p>
          <p>
            Help us transform healthcare by signing the Cure Acceleration Act
            petition, which aims to update FDA.gov to support automated and
            decentralized clinical trials.
          </p>
        </div>
      }
      primaryText="Sign Petition"
      primaryHref="/dfda/docs/cure-acceleration-act"
      secondaryText="Got it!"
      secondaryHref={null}
      persistKey="dfda-disclaimer-shown"
    >
      {children}
    </NeoBrutalModalLayout>
  )
}
