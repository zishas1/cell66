"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useParams, useRouter } from "next/navigation"
import { mockMailboxRentals } from "@/data/mock-mailboxes"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function MailboxDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const rentalId = params.id as string

  const rental = mockMailboxRentals.find((r) => r.id === rentalId)

  if (!rental) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <h1 className="text-3xl font-bold mb-4">Mailbox Rental Not Found</h1>
        <p className="text-gray-500 mb-6">The mailbox rental with ID &quot;{rentalId}&quot; could not be found.</p>
        <Button onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Rentals
        </Button>
        <h1 className="text-3xl font-bold">Mailbox Rental #{rental.mailboxNumber}</h1>
        <div className="flex gap-2">
          <Button variant="outline">Edit Rental</Button>
          <Button variant="destructive">Cancel Rental</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rental Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500">Customer</p>
            <Link href={`/dashboard/customers/${rental.customerId}`} className="text-lg font-medium hover:underline">
              {rental.customerName}
            </Link>
          </div>
          <div>
            <p className="text-sm text-gray-500">Mailbox Number</p>
            <p className="text-lg font-medium">{rental.mailboxNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Rental Rate</p>
            <p className="text-lg font-medium">${rental.rentalRate.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Rental Period</p>
            <p className="text-lg font-medium capitalize">{rental.rentalPeriod}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Start Date</p>
            <p className="text-lg font-medium">{rental.startDate}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">End Date</p>
            <p className="text-lg font-medium">{rental.endDate}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <Badge
              variant={
                rental.status === "Active" ? "default" : rental.status === "Expired" ? "destructive" : "secondary"
              }
            >
              {rental.status}
            </Badge>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm text-gray-500">Notes</p>
            <p className="text-lg font-medium">{rental.notes || "N/A"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
