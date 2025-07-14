"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type LineStatus, type ResellerCustomerLine, updateResellerCustomerLine } from "@/data/mock-resellers"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertCircle, Mail, Zap, UserCheck } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface ServiceStatusTrackerProps {
  line: ResellerCustomerLine
  onUpdate: () => void
}

const statusSteps: Record<LineStatus, { label: string; icon: React.ElementType; color: string }> = {
  cc_declined: { label: "CC Declined", icon: XCircle, color: "text-red-500" },
  notified_customer: { label: "Notified Customer", icon: Mail, color: "text-orange-500" },
  cancel_requested: { label: "Cancel Line Requested", icon: Zap, color: "text-yellow-500" },
  reactivated: { label: "Line Reactivated", icon: CheckCircle, color: "text-green-500" },
  active: { label: "Active", icon: CheckCircle, color: "text-green-500" },
  pending_activation: { label: "Pending Activation", icon: AlertCircle, color: "text-blue-500" },
  suspended: { label: "Suspended", icon: AlertCircle, color: "text-gray-500" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "text-gray-500" },
}

export function ServiceStatusTracker({ line, onUpdate }: ServiceStatusTrackerProps) {
  const [currentStatus, setCurrentStatus] = useState<LineStatus>(line.status)

  useEffect(() => {
    setCurrentStatus(line.status)
  }, [line.status])

  const handleNextStep = (newStatus: LineStatus) => {
    const updatedLine = updateResellerCustomerLine(line.id, { status: newStatus })
    if (updatedLine) {
      setCurrentStatus(newStatus)
      onUpdate()
      toast({
        title: "Status Updated",
        description: `Line ${line.simCardNumber} status changed to ${statusSteps[newStatus].label}.`,
      })
    } else {
      toast({
        title: "Error",
        description: "Failed to update line status.",
        variant: "destructive",
      })
    }
  }

  const renderActionButton = () => {
    switch (currentStatus) {
      case "cc_declined":
        return (
          <Button onClick={() => handleNextStep("notified_customer")} size="sm" className="mt-2">
            <Mail className="mr-2 h-4 w-4" /> Notify Customer
          </Button>
        )
      case "notified_customer":
        return (
          <div className="flex gap-2 mt-2">
            <Button onClick={() => handleNextStep("cancel_requested")} size="sm" variant="destructive">
              <Zap className="mr-2 h-4 w-4" /> Request Cancellation
            </Button>
            <Button onClick={() => handleNextStep("reactivated")} size="sm">
              <UserCheck className="mr-2 h-4 w-4" /> Customer Paid
            </Button>
          </div>
        )
      case "cancel_requested":
        return (
          <Button onClick={() => handleNextStep("cancelled")} size="sm" variant="destructive" className="mt-2">
            <XCircle className="mr-2 h-4 w-4" /> Confirm Cancellation
          </Button>
        )
      case "reactivated":
        return (
          <Button onClick={() => handleNextStep("active")} size="sm" className="mt-2">
            <CheckCircle className="mr-2 h-4 w-4" /> Mark Active
          </Button>
        )
      default:
        return null
    }
  }

  const isProblematic = ["cc_declined", "notified_customer", "cancel_requested"].includes(currentStatus)

  return (
    <Card className={cn("border", isProblematic ? "border-red-400" : "")}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {React.createElement(statusSteps[currentStatus].icon, {
            className: cn("h-5 w-5", statusSteps[currentStatus].color),
          })}
          {line.customerName} - {line.simCardNumber}
        </CardTitle>
        <CardDescription>Current Status: {statusSteps[currentStatus].label}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Last 4 CC: {line.ccLast4} | Declined Count: {line.ccDeclinedCount}
        </p>
        {renderActionButton()}
      </CardContent>
    </Card>
  )
}
