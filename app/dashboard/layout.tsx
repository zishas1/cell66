import type React from "react"
import { LayoutClientWrapper } from "@/app/dashboard/layout-client-wrapper"
import { AppSidebar } from "@/components/app-sidebar"
import { Header } from "@/components/header"
import { SidebarInset, SidebarRail } from "@/components/ui/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LayoutClientWrapper>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 overflow-auto">{children}</main>
      </SidebarInset>
      <SidebarRail />
    </LayoutClientWrapper>
  )
}
