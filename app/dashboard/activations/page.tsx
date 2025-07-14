"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlusCircle } from "lucide-react"
import { NewActivationModal } from "@/components/activations/new-activation-modal"
import { useState } from "react"

const mockActivations = [
  {
    id: "ACT001",
    customer: "John Doe",
    carrier: "Verizon",
    plan: "Unlimited Plus",
    date: "2023-10-26",
    status: "Active",
  },
  { id: "ACT002", customer: "Jane Smith", carrier: "AT&T", plan: "5G Premium", date: "2023-10-20", status: "Active" },
  {
    id: "ACT003",
    customer: "Bob Johnson",
    carrier: "T-Mobile",
    plan: "Essentials",
    date: "2023-10-15",
    status: "Pending",
  },
  {
    id: "ACT004",
    customer: "Alice Brown",
    carrier: "US Mobile",
    plan: "Pooled Plan",
    date: "2023-10-10",
    status: "Active",
  },
]

export default function ActivationsPage() {
  const [isNewActivationModalOpen, setIsNewActivationModalOpen] = useState(false)

  const handleNewActivation = (activationData: any) => {
    console.log("Creating new activation:", activationData)
    // In a real app, you'd send this to a backend
    setIsNewActivationModalOpen(false)
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Activations</h1>
        <Button onClick={() => setIsNewActivationModalOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" /> New Activation
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activations</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Carrier</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockActivations.map((activation) => (
                <TableRow key={activation.id}>
                  <TableCell className="font-medium">{activation.customer}</TableCell>
                  <TableCell>{activation.carrier}</TableCell>
                  <TableCell>{activation.plan}</TableCell>
                  <TableCell>{activation.date}</TableCell>
                  <TableCell>
                    <Badge variant={activation.status === "Active" ? "secondary" : "outline"}>
                      {activation.status}
                    </Badge>
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

      <NewActivationModal
        isOpen={isNewActivationModalOpen}
        onClose={() => setIsNewActivationModalOpen(false)}
        onNewActivation={handleNewActivation}
      />
    </div>
  )
}
