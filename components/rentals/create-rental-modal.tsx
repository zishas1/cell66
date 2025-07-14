"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { CustomerSearchSelect } from "@/components/customers/customer-search-select"
import { mockCustomers } from "@/data/mock-customers"
import type { RentalDetails, RentalItem } from "@/data/mock-rentals"
import { Plus, X } from "lucide-react"

interface CreateRentalModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (rental: RentalDetails) => void
  initialData?: RentalDetails
}

const mockCountries = ["USA", "Canada", "Mexico", "UK", "Germany", "France"]
const mockServicePlans = ["Unlimited Data", "5GB Plan", "10GB Plan", "20GB Plan", "Local Calls Only"]

export function CreateRentalModal({ isOpen, onClose, onSave, initialData }: CreateRentalModalProps) {
  const [customerId, setCustomerId] = useState(initialData?.customerId || "")
  const [customerName, setCustomerName] = useState(initialData?.customerName || "")
  const [rentalItems, setRentalItems] = useState<RentalItem[]>(
    initialData?.items && initialData.items.length > 0
      ? initialData.items
      : [{ name: "", quantity: 1, rate: 0, requiresService: false, country: "", servicePlan: "" }],
  )
  const [rentalPeriod, setRentalPeriod] = useState<"Daily" | "Weekly" | "Monthly">(initialData?.rentalPeriod || "Daily")
  const [startDate, setStartDate] = useState(initialData?.startDate || new Date().toISOString().split("T")[0])
  const [endDate, setEndDate] = useState(initialData?.endDate || "")
  const [isOngoing, setIsOngoing] = useState(initialData?.endDate === "")
  const [notes, setNotes] = useState(initialData?.notes || "")
  const [staffRepId, setStaffRepId] = useState(initialData?.staffRepId || "")
  const [depositAmount, setDepositAmount] = useState(initialData?.depositAmount || 0)

  useEffect(() => {
    if (initialData) {
      setCustomerId(initialData.customerId)
      setCustomerName(initialData.customerName)
      setRentalItems(initialData.items)
      setRentalPeriod(initialData.rentalPeriod)
      setStartDate(initialData.startDate)
      setEndDate(initialData.endDate || "")
      setIsOngoing(initialData.endDate === "")
      setNotes(initialData.notes)
      setStaffRepId(initialData.staffRepId || "")
      setDepositAmount(initialData.depositAmount || 0)
    } else {
      // Reset form for new creation
      setCustomerId("")
      setCustomerName("")
      setRentalItems([{ name: "", quantity: 1, rate: 0, requiresService: false, country: "", servicePlan: "" }])
      setRentalPeriod("Daily")
      setStartDate(new Date().toISOString().split("T")[0])
      setEndDate("")
      setIsOngoing(false)
      setNotes("")
      setStaffRepId("")
      setDepositAmount(0)
    }
  }, [isOpen, initialData])

  const handleAddItem = () => {
    setRentalItems([
      ...rentalItems,
      { name: "", quantity: 1, rate: 0, requiresService: false, country: "", servicePlan: "" },
    ])
  }

  const handleRemoveItem = (index: number) => {
    setRentalItems(rentalItems.filter((_, i) => i !== index))
  }

  const handleItemChange = (index: number, field: keyof RentalItem, value: string | number | boolean) => {
    const newItems = [...rentalItems]
    if (field === "quantity" || field === "rate") {
      newItems[index][field] = Number(value)
    } else if (field === "requiresService") {
      newItems[index][field] = value as boolean
      // Reset country and service plan if service is no longer required
      if (!value) {
        newItems[index].country = ""
        newItems[index].servicePlan = ""
      }
    } else {
      newItems[index][field] = value as string
    }
    setRentalItems(newItems)
  }

  const handleSubmit = () => {
    if (!customerId || rentalItems.some((item) => !item.name || item.rate <= 0) || !startDate) {
      alert("Please fill in all required fields: Customer, Item Name, Item Rate, Start Date.")
      return
    }

    if (!isOngoing && !endDate) {
      alert("Please provide an End Date for non-ongoing rentals.")
      return
    }

    // Validate service details if required
    if (rentalItems.some((item) => item.requiresService && (!item.country || !item.servicePlan))) {
      alert("Please select Country and Service Plan for all items requiring service.")
      return
    }

    const customer = mockCustomers.find((c) => c.id === customerId)
    const newRental: RentalDetails = {
      id: initialData?.id || `RENT${Date.now()}`,
      customerId: customerId,
      customerName: customer?.name || customerName,
      customerPhone: customer?.phone || "", // Assuming phone is available on customer object
      items: rentalItems, // Now an array of RentalItem
      rentalRate: rentalItems.reduce((sum, item) => sum + item.rate * item.quantity, 0), // Sum of all item rates
      rentalPeriod,
      startDate,
      endDate: isOngoing ? "" : endDate,
      status: initialData?.status || "Active",
      totalCost: initialData?.totalCost || 0, // Will be calculated in a real app
      notes,
      staffRepId: staffRepId || undefined,
      staffRepName: mockCustomers.find((c) => c.id === staffRepId)?.name || undefined,
      depositAmount: depositAmount || undefined,
      lateFees: initialData?.lateFees || 0,
    }
    onSave(newRental)
    onClose()
  }

  const handleCustomerSelect = (customer: { id: string; name: string }) => {
    setCustomerId(customer.id)
    setCustomerName(customer.name)
  }

  const mockStaffReps = mockCustomers.filter((c) => c.role === "sales_rep" || c.role === "admin")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Rental" : "Create New Rental"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="customer" className="text-right">
              Customer
            </Label>
            <div className="col-span-3">
              <CustomerSearchSelect onSelectCustomer={handleCustomerSelect} initialCustomerId={customerId} />
            </div>
          </div>

          {/* Multiple Rental Items */}
          <div className="space-y-4 col-span-full">
            <Label className="text-left font-semibold">Rental Items</Label>
            {rentalItems.map((item, index) => (
              <div key={index} className="border p-3 rounded-md relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveItem(index)}
                  disabled={rentalItems.length === 1}
                  className="absolute top-2 right-2 h-6 w-6"
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="grid grid-cols-6 items-center gap-2 mb-2">
                  <Input
                    placeholder="Item Name"
                    value={item.name}
                    onChange={(e) => handleItemChange(index, "name", e.target.value)}
                    className="col-span-4"
                  />
                  <Input
                    type="number"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                    className="col-span-1"
                    min="1"
                  />
                  <Input
                    type="number"
                    placeholder="Rate"
                    value={item.rate}
                    onChange={(e) => handleItemChange(index, "rate", e.target.value)}
                    className="col-span-1"
                    min="0"
                  />
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <Checkbox
                    id={`requires-service-${index}`}
                    checked={item.requiresService}
                    onCheckedChange={(checked) => handleItemChange(index, "requiresService", !!checked)}
                  />
                  <Label htmlFor={`requires-service-${index}`}>Requires Service/Data</Label>
                </div>
                {item.requiresService && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor={`country-${index}`} className="sr-only">
                        Country
                      </Label>
                      <Select
                        value={item.country || ""}
                        onValueChange={(value) => handleItemChange(index, "country", value)}
                      >
                        <SelectTrigger id={`country-${index}`}>
                          <SelectValue placeholder="Select Country" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockCountries.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor={`service-plan-${index}`} className="sr-only">
                        Service Plan
                      </Label>
                      <Select
                        value={item.servicePlan || ""}
                        onValueChange={(value) => handleItemChange(index, "servicePlan", value)}
                      >
                        <SelectTrigger id={`service-plan-${index}`}>
                          <SelectValue placeholder="Select Service Plan" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockServicePlans.map((plan) => (
                            <SelectItem key={plan} value={plan}>
                              {plan}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={handleAddItem} className="mt-2 bg-transparent">
              <Plus className="h-4 w-4 mr-2" /> Add Another Device
            </Button>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="period" className="text-right">
              Period
            </Label>
            <Select value={rentalPeriod} onValueChange={setRentalPeriod}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select rental period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Daily">Daily</SelectItem>
                <SelectItem value="Weekly">Weekly</SelectItem>
                <SelectItem value="Monthly">Monthly</SelectItem>
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
            <div className="col-start-2 col-span-3 flex items-center space-x-2">
              <Checkbox id="ongoing" checked={isOngoing} onCheckedChange={(checked) => setIsOngoing(!!checked)} />
              <Label htmlFor="ongoing">Ongoing Rental</Label>
            </div>
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
            <Label htmlFor="depositAmount" className="text-right">
              Deposit ($)
            </Label>
            <Input
              id="depositAmount"
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(Number.parseFloat(e.target.value))}
              className="col-span-3"
              placeholder="e.g., 100.00"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="staffRep" className="text-right">
              Staff Rep
            </Label>
            <Select value={staffRepId || "Unassigned"} onValueChange={setStaffRepId}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select staff rep" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Unassigned">Unassigned</SelectItem>
                {mockStaffReps.map((rep) => (
                  <SelectItem key={rep.id} value={rep.id}>
                    {rep.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right">
              Notes
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="col-span-3"
              placeholder="Any specific notes about the rental..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>{initialData ? "Save Changes" : "Create Rental"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
