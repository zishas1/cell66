"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Printer, CheckCircle, XCircle, DollarSign } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { CreateRentalModal } from "@/components/rentals/create-rental-modal"
import { getRentalById, updateRental, type RentalDetails } from "@/data/mock-rentals"
import { toast } from "@/hooks/use-toast"

export default function RentalDetailsPage({ params }: { params: { id: string } }) {
  const [rental, setRental] = useState<RentalDetails | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  useEffect(() => {
    const fetchedRental = getRentalById(params.id)
    setRental(fetchedRental || null)
  }, [params.id])

  if (!rental) {
    return <div className="p-6 text-center text-gray-500">Rental not found.</div>
  }

  const handlePrintAgreement = () => {
    window.print()
    toast({ title: "Printing Agreement", description: `Printing agreement for rental ${rental.id}.` })
  }

  const handleMarkReturned = () => {
    const updated = updateRental(rental.id, { status: "Completed", endDate: new Date().toISOString().split("T")[0] })
    if (updated) {
      setRental(updated)
      toast({ title: "Rental Updated", description: `Rental ${rental.id} marked as returned.` })
    } else {
      toast({ title: "Error", description: `Failed to mark rental ${rental.id} as returned.`, variant: "destructive" })
    }
  }

  const handleCancelRental = () => {
    const updated = updateRental(rental.id, { status: "Cancelled" })
    if (updated) {
      setRental(updated)
      toast({ title: "Rental Updated", description: `Rental ${rental.id} cancelled.` })
    } else {
      toast({ title: "Error", description: `Failed to cancel rental ${rental.id}.`, variant: "destructive" })
    }
  }

  const handleSaveRental = (updatedRentalData: RentalDetails) => {
    const updated = updateRental(rental.id, updatedRentalData)
    if (updated) {
      setRental(updated)
      setIsEditModalOpen(false)
      toast({ title: "Rental Updated", description: `Rental ${rental.id} details saved.` })
    } else {
      toast({ title: "Error", description: `Failed to save rental ${rental.id} details.`, variant: "destructive" })
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/rentals">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Rentals
          </Button>
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrintAgreement}>
            <Printer className="h-4 w-4 mr-2" /> Print Agreement
          </Button>
          <Button onClick={() => setIsEditModalOpen(true)}>
            <Edit className="h-4 w-4 mr-2" /> Edit Rental
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Rental #{rental.id} - {rental.item}
            <Badge
              variant={
                rental.status === "Active" ? "default" : rental.status === "Overdue" ? "destructive" : "secondary"
              }
            >
              {rental.status}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Customer Name:</p>
            <Link
              href={`/dashboard/customers/${rental.customerId}`}
              className="font-medium text-blue-600 hover:underline"
            >
              {rental.customerName}
            </Link>
            <p className="text-sm text-gray-500">Customer Phone:</p>
            <p className="font-medium">{rental.customerPhone}</p>
            <p className="text-sm text-gray-500">Item(s):</p>
            <p className="font-medium">{rental.item}</p>
            <p className="text-sm text-gray-500">Rental Rate:</p>
            <p className="font-medium">
              ${rental.rentalRate.toFixed(2)} / {rental.rentalPeriod}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Start Date:</p>
            <p className="font-medium">{rental.startDate}</p>
            <p className="text-sm text-gray-500">End Date:</p>
            <p className="font-medium">{rental.endDate ? rental.endDate : "Ongoing"}</p>
            <p className="text-sm text-gray-500">Deposit Amount:</p>
            <p className="font-medium">${(rental.depositAmount || 0).toFixed(2)}</p>
            <p className="text-sm text-gray-500">Staff Representative:</p>
            <p className="font-medium">{rental.staffRepName || "N/A"}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Financial Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="font-semibold">Total Estimated Cost:</p>
            <p className="text-xl font-bold">${rental.totalCost.toFixed(2)}</p>
          </div>
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>Late Fees Accrued:</span>
            <span className={rental.lateFees && rental.lateFees > 0 ? "text-red-600 font-semibold" : ""}>
              ${(rental.lateFees || 0).toFixed(2)}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700">{rental.notes || "No notes for this rental."}</p>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        {rental.status !== "Completed" && rental.status !== "Cancelled" && (
          <Button variant="destructive" onClick={handleCancelRental}>
            <XCircle className="h-4 w-4 mr-2" /> Cancel Rental
          </Button>
        )}
        {rental.status !== "Completed" && rental.status !== "Cancelled" && (
          <Button onClick={handleMarkReturned}>
            <CheckCircle className="h-4 w-4 mr-2" /> Mark as Returned
          </Button>
        )}
        {rental.status === "Overdue" && (
          <Button variant="secondary">
            <DollarSign className="h-4 w-4 mr-2" /> Charge Late Fee (Mock)
          </Button>
        )}
      </div>

      <CreateRentalModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveRental}
        initialData={rental}
      />
    </div>
  )
}
