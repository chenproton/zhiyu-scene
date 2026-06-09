"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AiFirstNewScenarioEditPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace("/ai-first/scenarios/scenario-1/edit")
  }, [router])
  return null
}
