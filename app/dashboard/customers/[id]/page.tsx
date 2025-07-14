"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Trash2, PlusCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { mockCustomers } from "@/data/mock-customers"
import { mockRentals } from "@/data/mock-rentals"
import { mockRepairs } from "@/data/mock-repairs" // Assuming you have mock repairs

// Mock data for customer's orders/sales
const mockCustomerOrders = [
  {
    id: "ORD001",
    customerId: "CUST001",
    date: "2023-10-25",
    items: [
      { name: "iPhone 15 Pro Max", quantity: 1, price: 1199.99 },
      { name: "iPhone 15 Pro Max Case", quantity: 1, price: 30.0 },
    ],
    total: 1229.99,
  },
  {
    id: "ORD002",
    customerId: "CUST001",
    date: "2023-09-15",
    items: [{ name: "AirPods Pro 2nd Gen", quantity: 1, price: 249.99 }],
    total: 249.99,
  },
  {
    id: "ORD003",
    customerId: "CUST002",
    date: "2023-11-01",
    items: [{ name: "Samsung Galaxy S24 Ultra", quantity: 1, price: 1299.99 }],
    total: 1299.99,
  },
]

export default function CustomerDetailsPage({ params }: { params: { id: string } }) {
  const customer = mockCustomers.find((c) => c.id === params.id)
  const customerRentals = mockRentals.filter((r) => r.customerId === params.id)
  const customerRepairs = mockRepairs.filter((r) => r.customerId === params.id)
  const customerOrders = mockCustomerOrders.filter((o) => o.customerId === params.id)

  const [isEditModalOpen, setIsEditModalOpen] = useState(false) // Placeholder for edit modal
  const [isAddOrderModalOpen, setIsAddOrderModalOpen] = useState(false) // Placeholder for add order modal

  if (!customer) {
    return <div className="p-6 text-center text-gray-500">Customer not found.</div>
  }

  // Calculate total spent from mock orders if not directly available on customer object
  const totalSpent = customer.totalSpent ?? customerOrders.reduce((sum, order) => sum + order.total, 0)

  const handleDeleteCustomer = () => {
    if (window.confirm(`Are you sure you want to delete ${customer.name}?`)) {
      alert("Customer deleted (mock action).")
      // In a real app, you'd make an API call and then redirect
      // router.push('/dashboard/customers');
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/customers">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Customers
          </Button>
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>
            <Edit className="h-4 w-4 mr-2" /> Edit Customer
          </Button>
          <Button variant="destructive" onClick={handleDeleteCustomer}>
            <Trash2 className="h-4 w-4 mr-2" /> Delete Customer
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {customer.name}
            <span className="text-sm text-gray-500">Customer ID: {customer.id}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Email:</p>
            <p className="font-medium">{customer.email}</p>
            <p className="text-sm text-gray-500">Phone:</p>
            <p className="font-medium">{customer.phone}</p>
            <p className="text-sm text-gray-500">Address:</p>
            <p className="font-medium">{customer.address}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Account Status:</p>
            <p className="font-medium">{customer.status}</p>
            <p className="text-sm text-gray-500">Total Spent:</p>
            <p className="font-medium">${totalSpent.toFixed(2)}</p>
            <p className="text-sm text-gray-500">Last Interaction:</p>
            <p className="font-medium">{customer.lastInteraction}</p>
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders/Sales */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Orders/Sales</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setIsAddOrderModalOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" /> Add New Sale
          </Button>
        </CardHeader>
        <CardContent>
          {customerOrders.length > 0 ? (
            <ul className="space-y-2">
              {customerOrders.map((order) => (
                <li key={order.id} className="flex items-center justify-between rounded-md bg-gray-50 p-3">
                  <div>
                    <p className="font-medium">Order #{order.id}</p>
                    <p className="text-sm text-gray-500">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${order.total.toFixed(2)}</p>
                    <Link href={`/dashboard/pos/${order.id}`} className="text-sm text-blue-600 hover:underline">
                      View Details
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No recent orders found.</p>
          )}
        </CardContent>
      </Card>

      {/* Active Rentals */}
      <Card>
        <CardHeader>
          <CardTitle>Active Rentals</CardTitle>
        </CardHeader>
        <CardContent>
          {customerRentals.length > 0 ? (
            <ul className="space-y-2">
              {customerRentals.map((rental) => (
                <li key={rental.id} className="flex items-center justify-between rounded-md bg-gray-50 p-3">
                  <div>
                    <p className="font-medium">{rental.item}</p>
                    <p className="text-sm text-gray-500">Due: {rental.returnDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">Status: {rental.status}</p>
                    <Link href={`/dashboard/rentals/${rental.id}`} className="text-sm text-blue-600 hover:underline">
                      View Details
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No active rentals found.</p>
          )}
        </CardContent>
      </Card>

      {/* Recent Repairs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Repairs</CardTitle>
        </CardHeader>
        <CardContent>
          {customerRepairs.length > 0 ? (
            <ul className="space-y-2">
              {customerRepairs.map((repair) => (
                <li key={repair.id} className="flex items-center justify-between rounded-md bg-gray-50 p-3">
                  <div>
                    <p className="font-medium">{repair.device}</p>
                    <p className="text-sm text-gray-500">Issue: {repair.issue}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">Status: {repair.status}</p>
                    <Link href={`/dashboard/repairs/${repair.id}`} className="text-sm text-blue-600 hover:underline">
                      View Details
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No recent repairs found.</p>
          )}
        </CardContent>
      </Card>

      {/* Placeholder Modals */}
      {/* <AddCustomerModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} initialData={customer} /> */}
      {/* <CreateSaleModal isOpen={isAddOrderModalOpen} onClose={() => setIsAddOrderModalOpen(false)} initialCustomer={customer} /> */}
    </div>
  )
}
