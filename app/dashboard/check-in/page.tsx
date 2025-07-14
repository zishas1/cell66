"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CustomerSearchSelect } from "@/components/customers/customer-search-select"
import { CustomerLookupModal } from "@/components/customers/customer-lookup-modal"
import { PlusCircle, Wrench, ShoppingCart, Calendar, UserCheck, Phone } from "lucide-react"
import Link from "next/link"

interface Customer {
  id: string
  name: string
  email: string
  phone: string
}

export default function CheckInPage() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isLookupModalOpen, setIsLookupModalOpen] = useState(false)

  const handleCustomerSelect = (customer: Customer | null) => {
    setSelectedCustomer(customer)
  }

  const handleCustomerLookup = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsLookupModalOpen(false)
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-3xl font-bold">Customer Check-in</h1>

      <Card>
        <CardHeader>
          <CardTitle>Select or Find Customer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <CustomerSearchSelect onCustomerSelect={handleCustomerSelect} selectedCustomer={selectedCustomer} />
          {selectedCustomer && (
            <div className="border rounded-md p-3 bg-gray-50">
              <p className="font-medium">{selectedCustomer.name}</p>
              <p className="text-sm text-gray-600">{selectedCustomer.email}</p>
              <p className="text-sm text-gray-600">{selectedCustomer.phone}</p>
            </div>
          )}
          <Button variant="outline" className="w-full bg-transparent" onClick={() => setIsLookupModalOpen(true)}>
            <UserCheck className="h-4 w-4 mr-2" /> Lookup Customer Details
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Choose Service Type</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/dashboard/pos" className="block">
            <Button
              variant="outline"
              className="h-24 w-full flex flex-col items-center justify-center gap-2 bg-transparent"
            >
              <ShoppingCart className="h-8 w-8" />
              <span className="text-lg font-semibold">POS Sale</span>
            </Button>
          </Link>
          <Link href="/dashboard/repairs" className="block">
            <Button
              variant="outline"
              className="h-24 w-full flex flex-col items-center justify-center gap-2 bg-transparent"
            >
              <Wrench className="h-8 w-8" />
              <span className="text-lg font-semibold">Repair Drop-off</span>
            </Button>
          </Link>
          <Link href="/dashboard/rentals" className="block">
            <Button
              variant="outline"
              className="h-24 w-full flex flex-col items-center justify-center gap-2 bg-transparent"
            >
              <Calendar className="h-8 w-8" />
              <span className="text-lg font-semibold">Rental Agreement</span>
            </Button>
          </Link>
          <Link href="/dashboard/activations" className="block">
            <Button
              variant="outline"
              className="h-24 w-full flex flex-col items-center justify-center gap-2 bg-transparent"
            >
              <Phone className="h-8 w-8" />
              <span className="text-lg font-semibold">New Activation</span>
            </Button>
          </Link>
          <Link href="/dashboard/customers" className="block">
            <Button
              variant="outline"
              className="h-24 w-full flex flex-col items-center justify-center gap-2 bg-transparent"
            >
              <PlusCircle className="h-8 w-8" />
              <span className="text-lg font-semibold">New Customer</span>
            </Button>
          </Link>
        </CardContent>
      </Card>

      <CustomerLookupModal
        isOpen={isLookupModalOpen}
        onClose={() => setIsLookupModalOpen(false)}
        onCustomerSelect={handleCustomerLookup}
      />
    </div>
  )
}
