"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CustomerSearchSelect } from "@/components/customers/customer-search-select"

interface NewActivationModalProps {
  isOpen: boolean
  onClose: () => void
  onNewActivation: (activationData: {
    customerId: string
    carrier: string
    plan: string
    deviceImei?: string
    simNumber?: string
  }) => void
}

interface Customer {
  id: string
  name: string
  email: string
  phone: string
}

export function NewActivationModal({ isOpen, onClose, onNewActivation }: NewActivationModalProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [carrier, setCarrier] = useState("")
  const [plan, setPlan] = useState("")
  const [deviceImei, setDeviceImei] = useState("")
  const [simNumber, setSimNumber] = useState("")

  const handleCustomerSelect = (customer: Customer | null) => {
    setSelectedCustomer(customer)
  }

  const handleSubmit = () => {
    if (selectedCustomer && carrier && plan) {
      onNewActivation({
        customerId: selectedCustomer.id,
        carrier,
        plan,
        deviceImei: deviceImei || undefined,
        simNumber: simNumber || undefined,
      })
      // Clear form fields
      setSelectedCustomer(null)
      setCarrier("")
      setPlan("")
      setDeviceImei("")
      setSimNumber("")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>New Activation</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="customer">Customer</Label>
            <CustomerSearchSelect onCustomerSelect={handleCustomerSelect} selectedCustomer={selectedCustomer} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="carrier">Carrier</Label>
              <Select value={carrier} onValueChange={setCarrier}>
                <SelectTrigger id="carrier">
                  <SelectValue placeholder="Select carrier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="verizon">Verizon</SelectItem>
                  <SelectItem value="att">AT&T</SelectItem>
                  <SelectItem value="tmobile">T-Mobile</SelectItem>
                  <SelectItem value="us_mobile">US Mobile</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan">Plan</Label>
              <Input
                id="plan"
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                placeholder="e.g., Unlimited Plus"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="deviceImei">Device IMEI (Optional)</Label>
            <Input
              id="deviceImei"
              value={deviceImei}
              onChange={(e) => setDeviceImei(e.target.value)}
              placeholder="Enter device IMEI"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="simNumber">SIM Card Number (Optional)</Label>
            <Input
              id="simNumber"
              value={simNumber}
              onChange={(e) => setSimNumber(e.target.value)}
              placeholder="Enter SIM card number"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={!selectedCustomer || !carrier || !plan}>
            Create Activation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
