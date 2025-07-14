"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { mockCustomers } from "@/data/mock-customers"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "sales_rep" | "technician" | "support_agent" | "customer" | "reseller"
}

interface AuthContextType {
  user: User | null
  login: (email: string, password?: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        localStorage.removeItem("currentUser")
      }
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(
    async (email: string, password?: string): Promise<boolean> => {
      setIsLoading(true)
      return new Promise((resolve) => {
        setTimeout(() => {
          const foundUser = mockCustomers.find((customer) => customer.email === email)
          if (foundUser) {
            const loggedInUser: User = {
              id: foundUser.id,
              name: foundUser.name,
              email: foundUser.email,
              role: foundUser.role as User["role"],
            }
            setUser(loggedInUser)
            localStorage.setItem("currentUser", JSON.stringify(loggedInUser))
            router.push("/dashboard")
            setIsLoading(false)
            resolve(true)
          } else {
            console.error("Login failed: User not found or invalid credentials")
            setUser(null)
            setIsLoading(false)
            resolve(false)
          }
        }, 500)
      })
    },
    [router],
  )

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem("currentUser")
    router.push("/login")
  }, [router])

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
