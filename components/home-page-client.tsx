"use client"

import { useMemo, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { HeroSection } from "@/components/hero-section"
import { ResultSection } from "@/components/result-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { AdvantagesSection } from "@/components/advantages-section"
import { FaqSection } from "@/components/faq-section"
import { SiteFooter } from "@/components/site-footer"

type HomePageClientProps = {
  isAuthenticated: boolean
  userEmail: string | null
  initialCredits: number
  lastSummary: string | null
}

export function HomePageClient({
  isAuthenticated,
  userEmail,
  initialCredits,
  lastSummary
}: HomePageClientProps) {
  const [summary, setSummary] = useState<string | null>(null)
  const [credits, setCredits] = useState(initialCredits)

  const displayedSummary = useMemo(() => {
    if (summary) return summary
    if (isAuthenticated && credits <= 0) return lastSummary
    return null
  }, [summary, isAuthenticated, credits, lastSummary])

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader isAuthenticated={isAuthenticated} userEmail={userEmail} credits={credits} />
      <main className="flex-1">
        <HeroSection
          onSummary={setSummary}
          isAuthenticated={isAuthenticated}
          credits={credits}
          onCreditsChange={setCredits}
        />
        <ResultSection summary={displayedSummary ?? undefined} />
        <HowItWorksSection />
        <AdvantagesSection />
        <FaqSection />
      </main>
      <SiteFooter />
    </div>
  )
}

