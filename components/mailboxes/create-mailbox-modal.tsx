"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useState, useEffect, useRef } from "react" // Import useRef
import { mockCustomers } from "@/data/mock-customers"
import type { Mailbox } from "@/data/mock-mailboxes"
import { toast } from "@/hooks/use-toast" // Import toast

interface CreateMailboxModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateMailbox: (rentalData: {
    customerId: string
    customerName: string
    mailboxNumber: string
    rentalRate: number
    rentalPeriod: "monthly" | "quarterly" | "annually"
    startDate: string
    endDate?: string // Made optional
    notes?: string
    idProofUrl?: string // New: ID Proof URL
  }) => void
  availableMailboxes: Mailbox[]
}

export function CreateMailboxModal({ isOpen, onClose, onCreateMailbox, availableMailboxes }: CreateMailboxModalProps) {
  const [customerId, setCustomerId] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [mailboxNumber, setMailboxNumber] = useState("")
  const [rentalRate, setRentalRate] = useState("")
  const [rentalPeriod, setRentalPeriod] = useState<"monthly" | "quarterly" | "annually">("monthly")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [notes, setNotes] = useState("")
  const [isOngoing, setIsOngoing] = useState(false)
  const [idProofFile, setIdProofFile] = useState<File | null>(null) // New state for file
  const fileInputRef = useRef<HTMLInputElement>(null) // Ref for file input

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setCustomerId("")
      setCustomerName("")
      setMailboxNumber("")
      setRentalRate("")
      setRentalPeriod("monthly")
      setStartDate("")
      setEndDate("")
      setNotes("")
      setIsOngoing(false)
      setIdProofFile(null) // Reset file
      if (fileInputRef.current) {
        fileInputRef.current.value = "" // Clear file input visually
      }
    }
  }, [isOpen])

  const handleSubmit = () => {
    if (!customerId || !mailboxNumber || !rentalRate || !rentalPeriod || !startDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (Customer, Mailbox, Rate, Period, Start Date).",
        variant: "destructive",
      })
      return
    }

    if (!isOngoing && !endDate) {
      toast({
        title: "Missing Information",
        description: "Please provide an End Date for non-ongoing rentals.",
        variant: "destructive",
      })
      return
    }

    const selectedCustomer = mockCustomers.find((c) => c.id === customerId)
    if (!selectedCustomer) {
      toast({ title: "Error", description: "Selected customer not found.", variant: "destructive" })
      return
    }

    // Mock ID proof URL for now
    const idProofUrl = idProofFile
      ? `/placeholder.svg?height=100&width=150&query=id%20proof%20for%20${selectedCustomer.name}`
      : undefined

    onCreateMailbox({
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      mailboxNumber,
      rentalRate: Number.parseFloat(rentalRate),
      rentalPeriod,
      startDate,
      endDate: isOngoing ? undefined : endDate,
      notes,
      idProofUrl,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Mailbox Rental</DialogTitle>
          <DialogDescription>Fill in the details for the new mailbox rental agreement.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="customer" className="text-right">
              Customer
            </Label>
            <Select onValueChange={(value) => setCustomerId(value)} value={customerId}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a customer" />
              </SelectTrigger>
              <SelectContent>
                {mockCustomers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="mailbox" className="text-right">
              Mailbox #
            </Label>
            <Select onValueChange={(value) => setMailboxNumber(value)} value={mailboxNumber}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select an available mailbox" />
              </SelectTrigger>
              <SelectContent>
                {availableMailboxes.length > 0 ? (
                  availableMailboxes.map((mailbox) => (
                    <SelectItem key={mailbox.id} value={mailbox.number}>
                      {mailbox.number}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-mailboxes" disabled>
                    No mailboxes available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="rate" className="text-right">
              Rental Rate ($)
            </Label>
            <Input
              id="rate"
              type="number"
              value={rentalRate}
              onChange={(e) => setRentalRate(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="period" className="text-right">
              Period
            </Label>
            <Select
              onValueChange={(value: "monthly" | "quarterly" | "annually") => setRentalPeriod(value)}
              value={rentalPeriod}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select rental period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="annually">Annually</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="startDate" className="text-right">
              Start Date
            </Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ongoing" className="text-right">
              Ongoing Rental
            </Label>
            <Checkbox
              id="ongoing"
              checked={isOngoing}
              onCheckedChange={(checked) => setIsOngoing(Boolean(checked))}
              className="col-span-3"
            />
          </div>
          {!isOngoing && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">
                End Date
              </Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="col-span-3"
              />
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="idProof" className="text-right">
              ID Proof
            </Label>
            <Input
              id="idProof"
              type="file"
              ref={fileInputRef}
              onChange={(e) => setIdProofFile(e.target.files ? e.target.files[0] : null)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right">
              Notes
            </Label>
            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Create Rental
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
