"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  Settings,
  Mail,
  Calendar,
  DollarSign,
  BarChart,
  RefreshCw,
  LogOut,
  ChevronUp,
  ChevronDown,
  PanelRight,
  Kanban,
  Mailbox,
  Phone,
  UserPlus,
  FileText,
  FileSearch,
  Bell,
  Receipt,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar" // Added Avatar imports
import { useAuth } from "@/components/auth-provider"
import { AccountSettingsModal } from "@/components/settings/account-settings-modal"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { state, isMobile } = useSidebar() // Get state and isMobile from useSidebar
  const [isAccountSettingsModalOpen, setIsAccountSettingsModalOpen] = React.useState(false)

  const getMenuItems = (role: string | undefined) => {
    // Define all possible menu items with their roles
    const allMenuItems = [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: Home,
        roles: ["admin", "sales_rep", "reseller", "technician", "support_agent", "customer"],
      },
      { title: "POS", href: "/dashboard/pos", icon: ShoppingCart, roles: ["admin", "sales_rep"] },
      { title: "Inventory", href: "/dashboard/inventory", icon: Package, roles: ["admin", "sales_rep", "technician"] },
      { title: "Customers", href: "/dashboard/customers", icon: Users, roles: ["admin", "sales_rep", "support_agent"] },
      {
        title: "Repairs",
        href: "/dashboard/repairs",
        icon: RefreshCw,
        roles: ["admin", "technician", "sales_rep", "customer"],
      },
      { title: "Rentals", href: "/dashboard/rentals", icon: Calendar, roles: ["admin", "sales_rep", "customer"] },
      { title: "Activations", href: "/dashboard/activations", icon: Phone, roles: ["admin", "sales_rep", "customer"] },
      { title: "Resellers", href: "/dashboard/resellers", icon: UserPlus, roles: ["admin", "sales_rep", "customer"] }, // Renamed from Referrals
      {
        title: "Work Items",
        href: "/dashboard/work-items",
        icon: Kanban,
        roles: ["admin", "technician", "sales_rep", "support_agent", "reseller", "customer"],
      },
      {
        title: "Mailboxes",
        href: "/dashboard/mailboxes",
        icon: Mailbox,
        roles: ["admin", "support_agent", "customer"],
      },
      { title: "Messages", href: "/dashboard/messages", icon: Mail, roles: ["admin", "support_agent"] }, // Using Mail icon for messages
      { title: "Banking", href: "/dashboard/banking", icon: DollarSign, roles: ["admin"] },
      {
        title: "Commissions",
        href: "/dashboard/commissions",
        icon: FileText,
        roles: ["admin", "sales_rep", "reseller"],
      },
      { title: "Reports", href: "/dashboard/reports", icon: BarChart, roles: ["admin", "sales_rep"] },
      { title: "Settings", href: "/dashboard/settings", icon: Settings, roles: ["admin"] },
      // Technician specific
      { title: "Diagnostics", href: "/dashboard/diagnostics", icon: FileSearch, roles: ["technician"] },
      { title: "Repair Guides", href: "/dashboard/guides", icon: FileText, roles: ["technician"] },
      // Support Agent specific
      { title: "Knowledge Base", href: "/dashboard/knowledge-base", icon: FileSearch, roles: ["support_agent"] },
      { title: "Announcements", href: "/dashboard/announcements", icon: Bell, roles: ["support_agent"] },
      // Customer specific
      { title: "My Orders", href: "/dashboard/orders", icon: ShoppingCart, roles: ["customer"] },
      { title: "Billing", href: "/dashboard/billing", icon: Receipt, roles: ["customer"] },
      // Reseller specific
      { title: "My Customers", href: "/reseller-portal/customers", icon: Users, roles: ["reseller"] },
      { title: "Setup New Line", href: "/reseller-portal/setup-line", icon: Phone, roles: ["reseller"] },
    ]

    // Group items by logical sections for better display in the sidebar
    const groupedItems: { label: string; items: (typeof allMenuItems)[0][] }[] = [
      { label: "Main", items: [] },
      { label: "Sales", items: [] },
      { label: "Operations", items: [] },
      { label: "Finance & Reports", items: [] },
      { label: "Repairs", items: [] },
      { label: "Support", items: [] },
      { label: "My Account", items: [] },
      { label: "Reseller Portal", items: [] },
      { label: "System", items: [] },
      { label: "Tools", items: [] },
      { label: "Resources", items: [] },
    ]

    allMenuItems.forEach((item) => {
      if (item.roles.includes(role || "customer")) {
        // Default to customer if role is undefined
        if (item.title === "Dashboard")
          groupedItems[0].items.push(item) // Main
        else if (["POS", "Inventory", "Customers", "Activations", "Resellers", "Commissions"].includes(item.title)) {
          if (role === "sales_rep")
            groupedItems[1].items.push(item) // Sales
          else if (role === "admin") groupedItems[2].items.push(item) // Operations
        } else if (["Work Items", "Mailboxes", "Messages"].includes(item.title)) {
          if (role === "admin")
            groupedItems[2].items.push(item) // Operations
          else if (
            role === "sales_rep" ||
            role === "technician" ||
            role === "support_agent" ||
            role === "reseller" ||
            role === "customer"
          )
            groupedItems[9].items.push(item) // Tools
        } else if (["Banking", "Commissions", "Reports"].includes(item.title))
          groupedItems[3].items.push(item) // Finance & Reports
        else if (["Repairs", "Rentals", "Diagnostics", "Repair Guides"].includes(item.title)) {
          if (role === "technician")
            groupedItems[4].items.push(item) // Repairs
          else if (role === "admin" || role === "sales_rep" || role === "customer") groupedItems[0].items.push(item) // Main
        } else if (["Support", "Knowledge Base", "Announcements"].includes(item.title))
          groupedItems[5].items.push(item) // Support
        else if (
          ["My Orders", "My Repairs", "My Rentals", "My Activations", "My Referrals", "Billing", "My Mailbox"].includes(
            item.title,
          )
        )
          groupedItems[6].items.push(item) // My Account
        else if (["My Customers", "Setup New Line", "My Commissions"].includes(item.title) && role === "reseller")
          groupedItems[7].items.push(item) // Reseller Portal
        else if (item.title === "Settings")
          groupedItems[8].items.push(item) // System
        else if (["Knowledge Base", "Announcements"].includes(item.title) && role === "support_agent")
          groupedItems[10].items.push(item) // Resources
      }
    })

    // Filter out empty groups
    return groupedItems.filter((group) => group.items.length > 0)
  }

  const menuItems = React.useMemo(() => getMenuItems(user?.role), [user?.role])

  return (
    <>
      <Sidebar {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                      <img src="/images/tower-logo.png" alt="Tower Mobile Logo" className="h-full w-full rounded-lg" />
                    </div>
                    <div className="flex flex-col gap-0.5 leading-none">
                      <span className="font-semibold group-data-[collapsible=icon]:hidden">Tower Mobile</span>
                      <span className="text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
                        {user?.role ? user.role.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) : "Guest"}
                      </span>
                    </div>
                    <ChevronDown className="ml-auto group-data-[collapsible=icon]:hidden" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]" align="start">
                  {/* Add a mock role switch for demonstration */}
                  <DropdownMenuItem onSelect={() => console.log("Switch Role (Mock) clicked")}>
                    <span>Switch Role (Mock)</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setIsAccountSettingsModalOpen(true)}>
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={logout}>
                    <span>Log Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          {menuItems.map((group, index) => (
            <React.Fragment key={group.label}>
              <SidebarGroup>
                <SidebarGroupLabel>
                  <span className="group-data-[collapsible=icon]:hidden">{group.label}</span>
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton asChild isActive={pathname === item.href}>
                          <Link href={item.href}>
                            <item.icon />
                            <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
              {index < menuItems.length - 1 && <SidebarSeparator />}
            </React.Fragment>
          ))}
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="/placeholder.svg?height=24&width=24&text=U" />
                      <AvatarFallback>{user?.name ? user.name.charAt(0) : "U"}</AvatarFallback>
                    </Avatar>
                    <span className="group-data-[collapsible=icon]:hidden">{user?.name || "Guest"}</span>
                    <ChevronUp className="ml-auto group-data-[collapsible=icon]:hidden" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                  <DropdownMenuItem onSelect={() => setIsAccountSettingsModalOpen(true)}>
                    <span>Account Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
            {state === "collapsed" && !isMobile && (
              <SidebarMenuItem>
                <SidebarTrigger className="w-full h-8 flex items-center justify-center">
                  <PanelRight className="h-5 w-5" />
                  <span className="sr-only">Expand Sidebar</span>
                </SidebarTrigger>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* Account Settings Modal */}
      <AccountSettingsModal
        isOpen={isAccountSettingsModalOpen}
        onClose={() => setIsAccountSettingsModalOpen(false)}
        user={user}
      />
    </>
  )
}
