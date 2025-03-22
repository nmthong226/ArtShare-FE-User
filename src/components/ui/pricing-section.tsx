import * as React from "react"
import { PricingCard, type PricingTier } from "@/components/ui/pricing-card"
import { Tab } from "@/components/ui/pricing-tab"
import { motion } from "motion/react"

interface PricingSectionProps {
  tiers: PricingTier[]
  frequencies: string[]
}

export function PricingSection({
  tiers,
  frequencies,
}: PricingSectionProps) {
  const [selectedFrequency, setSelectedFrequency] = React.useState(frequencies[0])

  return (
    <section className="flex flex-col items-center gap-10 py-10 w-full">
      <div className="text-center">
        <div className="flex bg-muted mx-auto p-1 rounded-full w-fit">
          {frequencies.map((freq) => (
            <Tab
              key={freq}
              text={freq}
              selected={selectedFrequency === freq}
              setSelected={setSelectedFrequency}
              discount={freq === "yearly"}
            />
          ))}
        </div>
      </div>
      <div className="gap-8 grid sm:grid-cols-2 xl:grid-cols-4 w-full max-w-8xl">
        {tiers.map((tier) => (
          <PricingCard
            key={tier.name}
            tier={tier}
            paymentFrequency={selectedFrequency}
          />
        ))}
      </div>
    </section>
  )
}