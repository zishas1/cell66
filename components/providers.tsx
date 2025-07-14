"use client"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/auth-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { GlobalPolyfills } from "@/components/global-polyfills"

export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <GlobalPolyfills />
      <AuthProvider>
        <SidebarProvider defaultOpen={true}>
          {" "}
          {/* Hardcoded to true for frontend-only */}
          {children}
        </SidebarProvider>
      </AuthProvider>
      <Toaster />
    </NextThemesProvider>
  )
}
