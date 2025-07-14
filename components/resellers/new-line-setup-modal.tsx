"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type LineType, type ServicePlan, addResellerCustomerLine } from "@/data/mock-resellers"
import { toast } from "@/hooks/use-toast"

interface NewLineSetupModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  resellerId: string
  onLineAdded: () => void
}

export function NewLineSetupModal({ open, onOpenChange, resellerId, onLineAdded }: NewLineSetupModalProps) {
  const [customerName, setCustomerName] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [simCardNumber, setSimCardNumber] = useState("")
  const [lineType, setLineType] = useState<LineType>("new_line")
  const [carrier, setCarrier] = useState("") // This will now be for "Other" carrier input
  const [selectedCarrierType, setSelectedCarrierType] = useState<"us_mobile" | "other">("us_mobile") // New state for carrier type
  const [portPin, setPortPin] = useState("")
  const [servicePlan, setServicePlan] = useState<ServicePlan>("basic")
  const [ccLast4, setCcLast4] = useState("")

  const handleSubmit = () => {
    if (!customerName || !customerEmail || !customerPhone || !simCardNumber || !servicePlan || !ccLast4) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    if (lineType === "transfer") {
      if (selectedCarrierType === "other" && !carrier) {
        toast({
          title: "Missing Information",
          description: "Carrier name is required for 'Other' transfers.",
          variant: "destructive",
        })
        return
      }
      if (!portPin) {
        toast({
          title: "Missing Information",
          description: "Port PIN is required for transfers.",
          variant: "destructive",
        })
        return
      }
    }

    const newLine = addResellerCustomerLine(resellerId, {
      customerName,
      customerEmail,
      customerPhone,
      simCardNumber,
      lineType,
      carrier: lineType === "transfer" ? (selectedCarrierType === "us_mobile" ? "US Mobile" : carrier) : undefined, // Use selectedCarrierType
      portPin: lineType === "transfer" ? portPin : undefined,
      servicePlan,
      customerId: "mock_customer_id", // Placeholder, ideally link to actual customer
      ccLast4,
    })

    if (newLine) {
      toast({
        title: "Line Added",
        description: `New line for ${customerName} added successfully!`,
      })
      onLineAdded()
      onOpenChange(false)
      // Reset form
      setCustomerName("")
      setCustomerEmail("")
      setCustomerPhone("")
      setSimCardNumber("")
      setLineType("new_line")
      setSelectedCarrierType("us_mobile") // Reset carrier type
      setCarrier("")
      setPortPin("")
      setServicePlan("basic")
      setCcLast4("")
    } else {
      toast({
        title: "Error",
        description: "Failed to add new line. Reseller not found.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Setup New Line</DialogTitle>
          <DialogDescription>Fill out the details for the new customer line.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="customerName" className="text-right">
              Customer Name
            </Label>
            <Input
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="customerEmail" className="text-right">
              Email
            </Label>
            <Input
              id="customerEmail"
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="customerPhone" className="text-right">
              Phone Number
            </Label>
            <Input
              id="customerPhone"
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="simCardNumber" className="text-right">
              SIM Card #
            </Label>
            <Input
              id="simCardNumber"
              value={simCardNumber}
              onChange={(e) => setSimCardNumber(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lineType" className="text-right">
              Line Type
            </Label>
            <Select value={lineType} onValueChange={(value: LineType) => setLineType(value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select line type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new_line">New Line</SelectItem>
                <SelectItem value="transfer">Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {lineType === "transfer" && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="carrierType" className="text-right">
                  Carrier Type
                </Label>
                <Select
                  value={selectedCarrierType}
                  onValueChange={(value: "us_mobile" | "other") => setSelectedCarrierType(value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select carrier type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us_mobile">US Mobile</SelectItem>
                    <SelectItem value="other">Other Carrier</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {selectedCarrierType === "other" && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="carrier" className="text-right">
                    Carrier Name
                  </Label>
                  <Input
                    id="carrier"
                    value={carrier}
                    onChange={(e) => setCarrier(e.target.value)}
                    className="col-span-3"
                    required
                  />
                </div>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="portPin" className="text-right">
                  Port PIN
                </Label>
                <Input
                  id="portPin"
                  value={portPin}
                  onChange={(e) => setPortPin(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
            </>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="servicePlan" className="text-right">
              Service Plan
            </Label>
            <Select value={servicePlan} onValueChange={(value: ServicePlan) => setServicePlan(value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select service plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ccLast4" className="text-right">
              CC Last 4
            </Label>
            <Input
              id="ccLast4"
              value={ccLast4}
              onChange={(e) => setCcLast4(e.target.value)}
              maxLength={4}
              className="col-span-3"
              required
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Setup Line
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
