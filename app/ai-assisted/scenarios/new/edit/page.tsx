"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AiAssistedNewScenarioEditPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace("/ai-assisted/scenarios/scenario-1/edit")
  }, [router])
  return null
}
