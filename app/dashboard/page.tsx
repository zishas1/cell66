"use client"

import { useAuth } from "@/components/auth-provider"
import { AdminDashboard } from "@/components/dashboards/admin-dashboard"
import { SalesRepDashboard } from "@/components/dashboards/sales-rep-dashboard"
import { ResellerDashboard } from "@/components/dashboards/reseller-dashboard"
import { TechnicianDashboard } from "@/components/dashboards/technician-dashboard"
import { SupportAgentDashboard } from "@/components/dashboards/support-agent-dashboard"
import { CustomerDashboard } from "@/components/dashboards/customer-dashboard"
import { redirect } from "next/navigation"
import { useEffect } from "react"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !user) {
      redirect("/login")
    }
  }, [user, isLoading])

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center text-lg">Loading dashboard...</div>
  }

  if (!user) {
    return null // Should redirect by useEffect, but good fallback
  }

  switch (user.role) {
    case "admin":
      return <AdminDashboard />
    case "sales_rep":
      return <SalesRepDashboard />
    case "reseller":
      return <ResellerDashboard />
    case "technician":
      return <TechnicianDashboard />
    case "support_agent":
      return <SupportAgentDashboard />
    case "customer":
      return <CustomerDashboard />
    default:
      return <div className="flex h-screen items-center justify-center text-lg">Unauthorized access. Unknown role.</div>
  }
}
