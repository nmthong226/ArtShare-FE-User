"use client"

import { BadgeCheck, ArrowRight } from "lucide-react"
import NumberFlow from "@number-flow/react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export interface PricingTier {
  name: string
  price: Record<string, number | string>
  description: string
  features: string[]
  cta: string
  highlighted?: boolean
  popular?: boolean
}

interface PricingCardProps {
  tier: PricingTier
  paymentFrequency: string
}

export function PricingCard({ tier, paymentFrequency }: PricingCardProps) {
  const price = tier.price[paymentFrequency]
  const isHighlighted = tier.highlighted
  const isPopular = tier.popular

  return (
    <Card
      className={cn(
        "relative flex flex-col gap-8 overflow-hidden p-6",
        isHighlighted
          ? "bg-gradient-to-b from-blue-800 to-purple-800 text-white"
          : "bg-background text-foreground",
        isPopular && "border-2 border-indigo-600"
      )}
    >
      {isHighlighted && <HighlightedBackground />}
      {isPopular && <PopularBackground />}

      <h2 className="flex items-center gap-3 font-medium text-xl capitalize">
        {tier.name}
        {isPopular && (
          <Badge variant="secondary" className="z-10 mt-1">
            🔥 Most Popular
          </Badge>
        )}
      </h2>

      <div className="relative h-12">
        {typeof price === "number" ? (
          <>
            <NumberFlow
              format={{
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0
              }}
              value={price}
              className="font-medium text-4xl"
            />
            <p className="-mt-2 text-muted-foreground text-xs">
              Per month/user
            </p>
          </>
        ) : (
          <h1 className="font-medium text-4xl">{price}</h1>
        )}
      </div>

      <div className="flex-1 space-y-2">
        <h3 className="font-medium text-sm">{tier.description}</h3>
        <ul className="space-y-2">
          {tier.features.map((feature, index) => (
            <li
              key={index}
              className={cn(
                "flex items-center gap-2 text-sm font-medium",
                isHighlighted ? "text-background" : "text-muted-foreground"
              )}
            >
              <BadgeCheck className="w-4 h-4" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <Button
        variant={isHighlighted ? "secondary" : "default"}
        className="w-full"
      >
        {tier.cta}
        <ArrowRight className="ml-2 w-4 h-4" />
      </Button>
    </Card>
  )
}

const HighlightedBackground = () => (
  <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:45px_45px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
)

const PopularBackground = () => (
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
)