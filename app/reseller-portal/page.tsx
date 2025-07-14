"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"
import { getResellerById, type Reseller, type ResellerCustomerLine } from "@/data/mock-resellers"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { NewLineSetupModal } from "@/components/resellers/new-line-setup-modal"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { ServiceStatusTracker } from "@/components/resellers/service-status-tracker"

export default function ResellerPortalPage() {
  const { user } = useAuth()
  const [resellerData, setResellerData] = useState<Reseller | null>(null)
  const [isNewLineModalOpen, setIsNewLineModalOpen] = useState(false)

  // Mock fetching reseller data based on logged-in user (assuming user.id maps to reseller.id)
  useEffect(() => {
    if (user && user.role === "reseller") {
      const data = getResellerById(user.id) // Assuming user.id is the resellerId
      setResellerData(data || null)
    }
  }, [user])

  const handleLineAdded = () => {
    if (user && user.role === "reseller") {
      const data = getResellerById(user.id)
      setResellerData(data || null)
    }
  }

  const handleLineStatusUpdate = () => {
    if (user && user.role === "reseller") {
      const data = getResellerById(user.id)
      setResellerData(data || null)
    }
  }

  const problematicLines: ResellerCustomerLine[] =
    resellerData?.customers.filter((line) =>
      ["cc_declined", "notified_customer", "cancel_requested"].includes(line.status),
    ) || []

  if (!user || user.role !== "reseller") {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Access Denied: You must be a reseller to view this portal.</p>
      </div>
    )
  }

  if (!resellerData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading reseller data...</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 p-6 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Welcome, {resellerData.name}!</h1>
        <Button onClick={() => setIsNewLineModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Setup New Line
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Overview</CardTitle>
          <CardDescription>Your current statistics and important information.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
            <h3 className="text-2xl font-bold">{resellerData.customers.length}</h3>
            <p className="text-sm text-muted-foreground">Total Active Lines</p>
          </div>
          <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
            <h3 className="text-2xl font-bold">{(resellerData.commissionRate * 100).toFixed(0)}%</h3>
            <p className="text-sm text-muted-foreground">Commission Rate</p>
          </div>
          <div className="flex flex-col items-center justify-center p-4 border rounded-lg">
            <h3 className="text-2xl font-bold">{problematicLines.length}</h3>
            <p className="text-sm text-muted-foreground">Lines Needing Attention</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My Customer Lines</CardTitle>
          <CardDescription>All lines you have set up.</CardDescription>
        </CardHeader>
        <CardContent>
          {resellerData.customers.length === 0 ? (
            <p className="text-muted-foreground">You haven't set up any customer lines yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>SIM #</TableHead>
                  <TableHead>Line Type</TableHead>
                  <TableHead>Service Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>CC Last 4</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resellerData.customers.map((line) => (
                  <TableRow key={line.id}>
                    <TableCell className="font-medium">{line.customerName}</TableCell>
                    <TableCell>{line.customerPhone}</TableCell>
                    <TableCell>{line.simCardNumber}</TableCell>
                    <TableCell>{line.lineType === "new_line" ? "New Line" : `Transfer (${line.carrier})`}</TableCell>
                    <TableCell>{line.servicePlan}</TableCell>
                    <TableCell>{line.status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</TableCell>
                    <TableCell>{line.ccLast4}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {problematicLines.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Lines Needing Attention</CardTitle>
            <CardDescription>Lines with payment issues or pending actions.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {problematicLines.map((line) => (
              <ServiceStatusTracker key={line.id} line={line} onUpdate={handleLineStatusUpdate} />
            ))}
          </CardContent>
        </Card>
      )}

      {resellerData && (
        <NewLineSetupModal
          open={isNewLineModalOpen}
          onOpenChange={setIsNewLineModalOpen}
          resellerId={resellerData.id}
          onLineAdded={handleLineAdded}
        />
      )}
    </div>
  )
}
