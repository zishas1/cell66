"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CustomerSearchSelect } from "@/components/customers/customer-search-select"

interface NewConversationModalProps {
  isOpen: boolean
  onClose: () => void
  onNewConversation: (conversationData: { customerId: string; subject: string; initialMessage: string }) => void
}

interface Customer {
  id: string
  name: string
  email: string
  phone: string
}

export function NewConversationModal({ isOpen, onClose, onNewConversation }: NewConversationModalProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [subject, setSubject] = useState("")
  const [initialMessage, setInitialMessage] = useState("")

  const handleCustomerSelect = (customer: Customer | null) => {
    setSelectedCustomer(customer)
  }

  const handleSubmit = () => {
    if (selectedCustomer && subject && initialMessage) {
      onNewConversation({
        customerId: selectedCustomer.id,
        subject,
        initialMessage,
      })
      // Clear form fields
      setSelectedCustomer(null)
      setSubject("")
      setInitialMessage("")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Start New Conversation</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="customer">Customer</Label>
            <CustomerSearchSelect onCustomerSelect={handleCustomerSelect} selectedCustomer={selectedCustomer} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="initialMessage">Initial Message</Label>
            <Textarea id="initialMessage" value={initialMessage} onChange={(e) => setInitialMessage(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={!selectedCustomer || !subject || !initialMessage}>
            Start Conversation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
