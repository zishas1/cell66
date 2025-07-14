"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, AlertTriangle } from "lucide-react"
import { CreateRentalModal } from "@/components/rentals/create-rental-modal"
import { useState, useEffect } from "react"
import { getAllRentals, type RentalDetails, updateRental } from "@/data/mock-rentals"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"

export default function RentalsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [rentals, setRentals] = useState<RentalDetails[]>([])

  useEffect(() => {
    setRentals(getAllRentals())
  }, [])

  const handleCreateRental = (rentalData: RentalDetails) => {
    console.log("Creating rental:", rentalData)
    setRentals((prev) => [...prev, rentalData])
    setIsCreateModalOpen(false)
    toast({ title: "Rental Created", description: `Rental for ${rentalData.customerName} added.` })
  }

  const handleMarkReturned = (rentalId: string) => {
    const updated = updateRental(rentalId, { status: "Completed", endDate: new Date().toISOString().split("T")[0] })
    if (updated) {
      setRentals(getAllRentals())
      toast({ title: "Rental Updated", description: `Rental ${rentalId} marked as returned.` })
    } else {
      toast({ title: "Error", description: `Failed to mark rental ${rentalId} as returned.`, variant: "destructive" })
    }
  }

  const handleChargeLateFee = (rentalId: string) => {
    const rental = rentals.find((r) => r.id === rentalId)
    if (rental) {
      const newLateFee = (rental.lateFees || 0) + 10 // Mock: add $10 late fee
      const updated = updateRental(rentalId, { lateFees: newLateFee })
      if (updated) {
        setRentals(getAllRentals())
        toast({
          title: "Late Fee Charged",
          description: `Charged $10 late fee for rental ${rentalId}. Total late fees: $${newLateFee.toFixed(2)}`,
        })
      }
    }
  }

  const overdueRentals = rentals.filter((rental) => rental.status === "Overdue").length

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Rentals</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" /> Create New Rental
        </Button>
      </div>

      {overdueRentals > 0 && (
        <Card className="border-red-400 bg-red-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700">Overdue Rentals</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-800">{overdueRentals}</div>
            <p className="text-xs text-red-600">Action required for overdue items.</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Rentals</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Item(s)</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Deposit</TableHead>
                <TableHead>Late Fees</TableHead>
                <TableHead>Staff Rep</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rentals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center text-gray-500">
                    No rentals found.
                  </TableCell>
                </TableRow>
              ) : (
                rentals.map((rental) => (
                  <TableRow key={rental.id} className={rental.status === "Overdue" ? "bg-red-50" : ""}>
                    <TableCell className="font-medium">
                      <Link href={`/dashboard/customers/${rental.customerId}`} className="hover:underline">
                        {rental.customerName}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {rental.items.map((item, idx) => (
                        <div key={idx}>
                          {item.name} (x{item.quantity})
                          {item.requiresService && item.country && item.servicePlan && (
                            <span className="text-xs text-gray-500 ml-1">
                              ({item.country} - {item.servicePlan})
                            </span>
                          )}
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>{rental.startDate}</TableCell>
                    <TableCell>{rental.endDate ? rental.endDate : "Ongoing"}</TableCell>
                    <TableCell>{rental.rentalPeriod}</TableCell>
                    <TableCell>${rental.rentalRate.toFixed(2)}</TableCell>
                    <TableCell>${(rental.depositAmount || 0).toFixed(2)}</TableCell>
                    <TableCell className={rental.lateFees && rental.lateFees > 0 ? "text-red-600 font-semibold" : ""}>
                      ${(rental.lateFees || 0).toFixed(2)}
                    </TableCell>
                    <TableCell>{rental.staffRepName || "N/A"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          rental.status === "Active"
                            ? "default"
                            : rental.status === "Overdue"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {rental.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {rental.status === "Overdue" && (
                          <Button variant="destructive" size="sm" onClick={() => handleChargeLateFee(rental.id)}>
                            Charge Late Fee
                          </Button>
                        )}
                        {rental.status === "Active" || rental.status === "Overdue" ? (
                          <Button variant="outline" size="sm" onClick={() => handleMarkReturned(rental.id)}>
                            Mark Returned
                          </Button>
                        ) : null}
                        <Link href={`/dashboard/rentals/${rental.id}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CreateRentalModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateRental}
      />
    </div>
  )
}
