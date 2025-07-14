"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, CalendarDays } from "lucide-react" // Import CalendarDays
import { CreateMailboxModal } from "@/components/mailboxes/create-mailbox-modal"
import { useState } from "react"
import {
  initialMailboxRentals,
  initialMailboxes,
  type MailboxRental,
  type Mailbox,
  addMailboxRental,
} from "@/data/mock-mailboxes" // Import addMailboxRental
import Link from "next/link"
import { toast } from "@/hooks/use-toast"

export default function MailboxesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [rentals, setRentals] = useState<MailboxRental[]>(initialMailboxRentals)
  const [mailboxes, setMailboxes] = useState<Mailbox[]>(initialMailboxes)

  const availableMailboxes = mailboxes.filter((mb) => mb.isAvailable)

  const handleCreateMailbox = (rentalData: Omit<MailboxRental, "id" | "status">) => {
    const newRental = addMailboxRental(rentalData) // Use the mock function to add
    if (newRental) {
      setRentals((prev) => [...prev, newRental])

      // Mark the rented mailbox as unavailable
      setMailboxes((prev) =>
        prev.map((mb) => (mb.number === newRental.mailboxNumber ? { ...mb, isAvailable: false } : mb)),
      )
      toast({
        title: "Mailbox Rental Created",
        description: `Mailbox ${newRental.mailboxNumber} rented to ${newRental.customerName}.`,
      })
    } else {
      toast({ title: "Error", description: "Failed to create mailbox rental.", variant: "destructive" })
    }
    setIsCreateModalOpen(false)
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mailbox Rentals</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" /> Create New Rental
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Mailboxes</CardTitle>
        </CardHeader>
        <CardContent>
          {availableMailboxes.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {availableMailboxes.map((mailbox) => (
                <div
                  key={mailbox.id}
                  className="flex flex-col items-center justify-center p-4 border rounded-lg shadow-sm bg-gray-50"
                >
                  <span className="text-2xl font-bold text-primary">#{mailbox.number}</span>
                  <span className="text-sm text-gray-500">Available</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">No mailboxes currently available for rent.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mailbox Availability Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-48 bg-muted rounded-md text-muted-foreground p-4 text-center">
            <CalendarDays className="h-12 w-12 mb-4 text-primary" />
            <p className="text-lg font-semibold mb-2">Interactive Calendar View Coming Soon!</p>
            <p className="text-sm">
              Visualize mailbox availability at a glance and manage bookings directly from a calendar interface.
            </p>
            <Button variant="outline" className="mt-4 bg-transparent" disabled>
              View Calendar (Mock)
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Mailbox Rentals</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Mailbox #</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>ID Proof</TableHead> {/* New column */}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rentals.length > 0 ? (
                rentals.map((rental) => (
                  <TableRow key={rental.id}>
                    <TableCell className="font-medium">
                      <Link href={`/dashboard/customers/${rental.customerId}`} className="hover:underline">
                        {rental.customerName}
                      </Link>
                    </TableCell>
                    <TableCell>{rental.mailboxNumber}</TableCell>
                    <TableCell>{rental.rentalPeriod}</TableCell>
                    <TableCell>{rental.startDate}</TableCell>
                    <TableCell>{rental.endDate ? rental.endDate : "Ongoing"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          rental.status === "active"
                            ? "default"
                            : rental.status === "expired"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {rental.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {rental.idProofUrl ? (
                        <a
                          href={rental.idProofUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View ID
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/dashboard/mailboxes/${rental.id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-gray-500">
                    No mailbox rentals found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CreateMailboxModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateMailbox={handleCreateMailbox}
        availableMailboxes={availableMailboxes}
      />
    </div>
  )
}
