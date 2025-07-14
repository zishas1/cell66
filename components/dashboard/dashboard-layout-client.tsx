"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { useSidebar } from "@/components/ui/sidebar"

export function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const { state } = useSidebar()

  return (
    <div
      className={cn(
        "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
        "group-data-[collapsible=offcanvas]:w-0",
        "group-data-[side=right]:rotate-180",
      )}
      data-state={state}
      data-collapsible={state === "collapsed" ? "icon" : ""} // Assuming 'icon' as default collapsible type
      data-variant="sidebar" // Assuming 'sidebar' as default variant
    >
      {children}
    </div>
  )
}
