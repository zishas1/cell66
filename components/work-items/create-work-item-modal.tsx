"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CustomerSearchSelect } from "@/components/customers/customer-search-select"
import type { WorkItemType } from "@/data/mock-work-items"
import type { Customer } from "@/data/mock-customers"

interface CreateWorkItemModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateWorkItem: (itemData: {
    type: WorkItemType
    title: string
    description: string
    priority: "Low" | "Medium" | "High"
    assignedTo: string
    dueDate?: string
    customer?: Customer
  }) => void
}

export function CreateWorkItemModal({ isOpen, onClose, onCreateWorkItem }: CreateWorkItemModalProps) {
  const [type, setType] = useState<WorkItemType>("task")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Medium")
  const [assignedTo, setAssignedTo] = useState("unassigned")
  const [dueDate, setDueDate] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  const handleSubmit = () => {
    if (!title || !description) return

    const commonData = {
      type,
      title,
      description,
      priority,
      assignedTo,
    }

    if (type === "task") {
      onCreateWorkItem({ ...commonData, dueDate: dueDate || undefined })
    } else {
      // type === "support_ticket"
      if (!selectedCustomer) return // Customer is required for support tickets
      onCreateWorkItem({ ...commonData, customer: selectedCustomer })
    }

    // Clear form fields
    setType("task")
    setTitle("")
    setDescription("")
    setPriority("Medium")
    setAssignedTo("unassigned")
    setDueDate("")
    setSelectedCustomer(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Work Item</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="type">Item Type</Label>
            <Select value={type} onValueChange={(value: WorkItemType) => setType(value)}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="task">Task</SelectItem>
                <SelectItem value="support_ticket">Support Ticket</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {type === "support_ticket" && (
            <div className="space-y-2">
              <Label htmlFor="customer">Customer</Label>
              <CustomerSearchSelect onCustomerSelect={setSelectedCustomer} selectedCustomer={selectedCustomer} />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={(value: "Low" | "Medium" | "High") => setPriority(value)}>
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assigned To</Label>
              <Select value={assignedTo} onValueChange={setAssignedTo}>
                <SelectTrigger id="assignedTo">
                  <SelectValue placeholder="Assign to" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  <SelectItem value="John Doe">John Doe</SelectItem>
                  <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {type === "task" && (
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={!title || !description || (type === "support_ticket" && !selectedCustomer)}
          >
            Create Work Item
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
