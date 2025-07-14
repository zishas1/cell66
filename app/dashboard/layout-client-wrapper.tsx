"use client"

import type React from "react"

import { useAuth } from "@/components/auth-provider"
import { DashboardLayoutClient } from "@/components/dashboard/dashboard-layout-client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function LayoutClientWrapper({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return <div>Loading application...</div> // Or a more sophisticated loading spinner
  }

  return <DashboardLayoutClient>{children}</DashboardLayoutClient>
}
