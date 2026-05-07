"use client"

import { useEffect, useState } from "react"
import { PlatformShell } from "@/platform-navigation-shell"
import { senceNavigationTemplate } from "@/platform-navigation-shell"

function isEmbedded() {
  if (typeof window === "undefined") return false
  try {
    if (window.self !== window.top) return true
    if (window.location.search.includes("embedded=1")) return true
    if (document.documentElement.classList.contains("embedded")) return true
  } catch {
    // cross-origin iframe
    return true
  }
  return false
}

export function PlatformShellWrapper({ children }: { children: React.ReactNode }) {
  const [embedded, setEmbedded] = useState(false)

  useEffect(() => {
    setEmbedded(isEmbedded())
  }, [])

  if (embedded) {
    return <>{children}</>
  }

  return <PlatformShell config={senceNavigationTemplate}>{children}</PlatformShell>
}
