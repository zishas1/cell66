"use client"

import { useState, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { mockCustomers } from "@/data/mock-customers"

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  loyaltyPoints: number
  lastPurchase: string
  totalSpent: number
}

interface CustomerLookupModalProps {
  isOpen: boolean
  onClose: () => void
  onCustomerSelect: (customer: Customer) => void
}

export function CustomerLookupModal({ isOpen, onClose, onCustomerSelect }: CustomerLookupModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  const filteredCustomers = useMemo(() => {
    if (!searchTerm) return []
    const lowerCaseSearchTerm = searchTerm.toLowerCase()
    return mockCustomers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        customer.email.toLowerCase().includes(lowerCaseSearchTerm) ||
        customer.phone.includes(lowerCaseSearchTerm),
    )
  }, [searchTerm])

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setSearchTerm(customer.name) // Populate search bar with selected customer's name
  }

  const handleConfirmSelection = () => {
    if (selectedCustomer) {
      onCustomerSelect(selectedCustomer)
      setSearchTerm("")
      setSelectedCustomer(null)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Customer Lookup</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, email, or phone..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {searchTerm && (
            <div className="max-h-48 overflow-y-auto border rounded-md">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleSelectCustomer(customer)}
                  >
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-gray-500">
                        {customer.phone} • {customer.email}
                      </p>
                    </div>
                    {selectedCustomer?.id === customer.id && <span className="text-xs text-blue-600">Selected</span>}
                  </div>
                ))
              ) : (
                <p className="p-2 text-center text-gray-500">No customers found.</p>
              )}
            </div>
          )}

          {selectedCustomer && (
            <div className="border p-4 rounded-md space-y-2 bg-gray-50">
              <h3 className="font-semibold text-lg">{selectedCustomer.name}</h3>
              <p className="text-sm text-gray-600">Email: {selectedCustomer.email}</p>
              <p className="text-sm text-gray-600">Phone: {selectedCustomer.phone}</p>
              <p className="text-sm text-gray-600">Address: {selectedCustomer.address}</p>
              <p className="text-sm text-gray-600">Loyalty Points: {selectedCustomer.loyaltyPoints}</p>
              <p className="text-sm text-gray-600">Last Purchase: {selectedCustomer.lastPurchase}</p>
              <p className="text-sm text-gray-600">Total Spent: ${selectedCustomer.totalSpent.toFixed(2)}</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleConfirmSelection} disabled={!selectedCustomer}>
            Select Customer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
