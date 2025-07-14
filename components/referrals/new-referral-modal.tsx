"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { CustomerSearchSelect } from "@/components/customers/customer-search-select"

interface NewReferralModalProps {
  isOpen: boolean
  onClose: () => void
  onNewReferral: (referralData: { referrerId: string; referredCustomerId: string; notes?: string }) => void
}

interface Customer {
  id: string
  name: string
  email: string
  phone: string
}

export function NewReferralModal({ isOpen, onClose, onNewReferral }: NewReferralModalProps) {
  const [referrer, setReferrer] = useState<Customer | null>(null)
  const [referredCustomer, setReferredCustomer] = useState<Customer | null>(null)
  const [notes, setNotes] = useState("")

  const handleReferrerSelect = (customer: Customer | null) => {
    setReferrer(customer)
  }

  const handleReferredCustomerSelect = (customer: Customer | null) => {
    setReferredCustomer(customer)
  }

  const handleSubmit = () => {
    if (referrer && referredCustomer) {
      onNewReferral({
        referrerId: referrer.id,
        referredCustomerId: referredCustomer.id,
        notes: notes || undefined,
      })
      // Clear form fields
      setReferrer(null)
      setReferredCustomer(null)
      setNotes("")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Referral</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="referrer">Referrer (Existing Customer)</Label>
            <CustomerSearchSelect onCustomerSelect={handleReferrerSelect} selectedCustomer={referrer} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="referredCustomer">Referred Customer (New or Existing)</Label>
            <CustomerSearchSelect onCustomerSelect={handleReferredCustomerSelect} selectedCustomer={referredCustomer} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Input id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={!referrer || !referredCustomer}>
            Create Referral
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
