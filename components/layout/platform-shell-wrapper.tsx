"use client"

import { PlatformShell } from "@/platform-navigation-shell"
import { senceNavigationTemplate } from "@/platform-navigation-shell"

export function PlatformShellWrapper({ children }: { children: React.ReactNode }) {
  return <PlatformShell config={senceNavigationTemplate}>{children}</PlatformShell>
}
