"use client"

import { CardDescription } from "@/components/ui/card"

import { useState, useEffect } from "react"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NewLineSetupModal } from "@/components/resellers/new-line-setup-modal"
import { ServiceStatusTracker } from "@/components/resellers/service-status-tracker"
import { getAllResellers, mockResellers, type Reseller, type ResellerCustomerLine } from "@/data/mock-resellers"

export default function ResellersPage() {
  const [isNewLineModalOpen, setIsNewLineModalOpen] = useState(false)
  const [selectedResellerId, setSelectedResellerId] = useState<string | null>(null)
  const [resellers, setResellers] = useState<Reseller[]>(mockResellers)

  useEffect(() => {
    setResellers(getAllResellers())
  }, [])

  const handleNewLineAdded = () => {
    setResellers(getAllResellers()) // Refresh data
  }

  const handleLineStatusUpdate = () => {
    setResellers(getAllResellers()) // Refresh data
  }

  const problematicLines: ResellerCustomerLine[] = resellers.flatMap((reseller) =>
    reseller.customers.filter((line) => ["cc_declined", "notified_customer", "cancel_requested"].includes(line.status)),
  )

  return (
    <div className="grid gap-6 p-6 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Resellers</h1>
        <Button
          onClick={() => {
            // For simplicity, we'll just pick the first reseller for new line setup
            // In a real app, you'd select a reseller or have a dedicated reseller portal
            if (resellers.length > 0) {
              setSelectedResellerId(resellers[0].id)
              setIsNewLineModalOpen(true)
            } else {
              // Handle case where no resellers exist
              alert("Please add a reseller first.")
            }
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Setup New Line
        </Button>
      </div>

      <Tabs defaultValue="reseller-list">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="reseller-list">Reseller List</TabsTrigger>
          <TabsTrigger value="service-status">Service Status Tracker</TabsTrigger>
        </TabsList>
        <TabsContent value="reseller-list">
          <Card>
            <CardHeader>
              <CardTitle>All Resellers</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact Email</TableHead>
                    <TableHead>Contact Phone</TableHead>
                    <TableHead>Commission Rate</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Customers (Lines)</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resellers.map((reseller) => (
                    <TableRow key={reseller.id}>
                      <TableCell className="font-medium">{reseller.name}</TableCell>
                      <TableCell>{reseller.contactEmail}</TableCell>
                      <TableCell>{reseller.contactPhone}</TableCell>
                      <TableCell>{(reseller.commissionRate * 100).toFixed(0)}%</TableCell>
                      <TableCell>{reseller.status}</TableCell>
                      <TableCell>{reseller.customers.length}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedResellerId(reseller.id)
                            setIsNewLineModalOpen(true)
                          }}
                        >
                          Setup Line
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {resellers.map((reseller) => (
            <Card key={reseller.id} className="mt-6">
              <CardHeader>
                <CardTitle>{reseller.name}'s Customer Lines</CardTitle>
                <CardDescription>Lines managed by {reseller.name}</CardDescription>
              </CardHeader>
              <CardContent>
                {reseller.customers.length === 0 ? (
                  <p className="text-muted-foreground">No customer lines for this reseller yet.</p>
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
                        <TableHead>Declined Count</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reseller.customers.map((line) => (
                        <TableRow key={line.id}>
                          <TableCell className="font-medium">{line.customerName}</TableCell>
                          <TableCell>{line.customerPhone}</TableCell>
                          <TableCell>{line.simCardNumber}</TableCell>
                          <TableCell>
                            {line.lineType === "new_line" ? "New Line" : `Transfer (${line.carrier})`}
                          </TableCell>
                          <TableCell>{line.servicePlan}</TableCell>
                          <TableCell>
                            {line.status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                          </TableCell>
                          <TableCell>{line.ccLast4}</TableCell>
                          <TableCell>{line.ccDeclinedCount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="service-status">
          <Card>
            <CardHeader>
              <CardTitle>Automated Service Status Tracker</CardTitle>
              <CardDescription>Monitor lines with payment issues and manage service actions.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {problematicLines.length === 0 ? (
                <p className="text-muted-foreground col-span-full">No lines currently in a problematic status.</p>
              ) : (
                problematicLines.map((line) => (
                  <ServiceStatusTracker key={line.id} line={line} onUpdate={handleLineStatusUpdate} />
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedResellerId && (
        <NewLineSetupModal
          open={isNewLineModalOpen}
          onOpenChange={setIsNewLineModalOpen}
          resellerId={selectedResellerId}
          onLineAdded={handleNewLineAdded}
        />
      )}
    </div>
  )
}
