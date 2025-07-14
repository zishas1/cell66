"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlusCircle } from "lucide-react"
import { NewReferralModal } from "@/components/referrals/new-referral-modal"
import { useState } from "react"

const mockReferrals = [
  { id: "REF001", referrer: "John Doe", referred: "Alice Brown", date: "2023-10-20", status: "Pending Payout" },
  { id: "REF002", referrer: "Jane Smith", referred: "Bob Johnson", date: "2023-10-15", status: "Paid" },
  { id: "REF003", referrer: "Admin", referred: "Charlie Davis", date: "2023-10-10", status: "New" },
]

export default function ReferralsPage() {
  const [isNewReferralModalOpen, setIsNewReferralModalOpen] = useState(false)

  const handleNewReferral = (referralData: any) => {
    console.log("Creating new referral:", referralData)
    // In a real app, you'd send this to a backend
    setIsNewReferralModalOpen(false)
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Referrals</h1>
        <Button onClick={() => setIsNewReferralModalOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" /> New Referral
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Referrals</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Referrer</TableHead>
                <TableHead>Referred Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockReferrals.map((referral) => (
                <TableRow key={referral.id}>
                  <TableCell className="font-medium">{referral.referrer}</TableCell>
                  <TableCell>{referral.referred}</TableCell>
                  <TableCell>{referral.date}</TableCell>
                  <TableCell>
                    <Badge variant={referral.status === "Paid" ? "secondary" : "outline"}>{referral.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <NewReferralModal
        isOpen={isNewReferralModalOpen}
        onClose={() => setIsNewReferralModalOpen(false)}
        onNewReferral={handleNewReferral}
      />
    </div>
  )
}
