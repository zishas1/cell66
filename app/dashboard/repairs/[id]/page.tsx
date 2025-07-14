"use client"

import { useState, useEffect, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Wrench, Clock, CheckCircle, DollarSign, Calendar, User, ClipboardList, ArrowLeft, Edit } from "lucide-react"
import { mockRepairs, type Repair } from "@/data/mock-repairs"
import { mockCustomers } from "@/data/mock-customers"
import { CreateRepairModal, type RepairFormData } from "@/components/repairs/create-repair-modal"

export default function RepairDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const repairId = params.id as string

  const [repair, setRepair] = useState<Repair | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [formData, setFormData] = useState<RepairFormData | null>(null)

  useEffect(() => {
    if (repairId) {
      const foundRepair = mockRepairs.find((r) => r.id === repairId)
      if (foundRepair) {
        setRepair(foundRepair)
        setFormData({
          customerId: foundRepair.customerId,
          assignedTo: foundRepair.assignedTo,
          notes: foundRepair.notes,
          repairItems: foundRepair.repairItems.map((item) => ({
            id: item.id || crypto.randomUUID(),
            brand: item.brand,
            model: item.model,
            issueDescription: item.issueDescription,
            estimatedCost: item.itemTotalCost,
            partsUsed: item.partsUsed,
            laborCost: item.laborCost,
            estimatedTime: item.estimatedTime,
          })),
        })
      } else {
        // Handle repair not found, e.g., redirect to 404 or repairs list
        router.push("/dashboard/repairs")
      }
    }
  }, [repairId, router])

  const customer = useMemo(() => {
    return mockCustomers.find((c) => c.id === repair?.customerId)
  }, [repair])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "In Progress":
        return (
          <Badge variant="default">
            <Wrench className="h-3 w-3 mr-1" />
            In Progress
          </Badge>
        )
      case "Pending Parts":
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            Pending Parts
          </Badge>
        )
      case "Completed":
        return (
          <Badge variant="default" className="bg-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        )
      case "Ready for Pickup":
        return (
          <Badge variant="outline">
            <CheckCircle className="h-3 w-3 mr-1" />
            Ready for Pickup
          </Badge>
        )
      case "Pending Quote":
        return <Badge variant="outline">Pending Quote</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "High":
        return <Badge variant="destructive">High</Badge>
      case "Medium":
        return <Badge variant="secondary">Medium</Badge>
      case "Low":
        return <Badge variant="outline">Low</Badge>
      default:
        return <Badge variant="outline">N/A</Badge>
    }
  }

  const handleSaveRepair = (updatedData: RepairFormData) => {
    if (!repair) return

    const updatedRepair: Repair = {
      ...repair,
      customerId: updatedData.customerId,
      customer: mockCustomers.find((c) => c.id === updatedData.customerId)?.name || "Unknown Customer",
      assignedTo: updatedData.assignedTo || "Unassigned",
      notes: updatedData.notes || "",
      repairItems: updatedData.repairItems.map((item) => ({
        id: item.id,
        brand: item.brand,
        model: item.model,
        issueDescription: item.issueDescription,
        partsUsed: item.partsUsed,
        laborCost: typeof item.laborCost === "number" ? item.laborCost : 0,
        itemTotalCost: typeof item.estimatedCost === "number" ? item.estimatedCost : 0,
        estimatedTime: item.estimatedTime,
      })),
      totalCost: updatedData.repairItems.reduce(
        (sum, item) => sum + (typeof item.estimatedCost === "number" ? item.estimatedCost : 0),
        0,
      ),
    }

    // In a real app, you'd send this to your backend
    console.log("Saving repair:", updatedRepair)
    setRepair(updatedRepair) // Update local state
    setIsEditMode(false)
  }

  if (!repair) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading repair details...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Repairs
        </Button>
        <h1 className="text-3xl font-bold">Repair #{repair.id}</h1>
        <Button onClick={() => setIsEditMode(true)}>
          <Edit className="h-4 w-4 mr-2" /> Edit Repair
        </Button>
      </div>

      {/* Repair Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getStatusBadge(repair.status)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned To</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{repair.assignedTo}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Estimated Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${repair.totalCost.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Details Section */}
      <Card>
        <CardHeader>
          <CardTitle>Repair Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Customer</Label>
              <p className="font-medium">
                {customer ? (
                  <a href={`/dashboard/customers/${customer.id}`} className="text-blue-600 hover:underline">
                    {customer.name} ({customer.phone})
                  </a>
                ) : (
                  repair.customer
                )}
              </p>
            </div>
            <div className="space-y-1">
              <Label>Received Date</Label>
              <p className="font-medium flex items-center gap-1">
                <Calendar className="h-4 w-4" /> {repair.receivedDate}
              </p>
            </div>
            <div className="space-y-1">
              <Label>Priority</Label>
              <p className="font-medium">{getPriorityBadge(repair.priority)}</p>
            </div>
            <div className="space-y-1">
              <Label>Estimated Completion</Label>
              <p className="font-medium flex items-center gap-1">
                <Clock className="h-4 w-4" /> {repair.estimatedCompletion}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <p className="text-sm text-muted-foreground">{repair.notes || "No notes."}</p>
          </div>

          <h3 className="text-lg font-semibold mt-4">Repair Items</h3>
          {repair.repairItems.map((item, index) => (
            <Card key={item.id || index} className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Device</Label>
                  <p className="font-medium">
                    {item.brand} {item.model}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label>Issue</Label>
                  <p className="font-medium">{item.issueDescription}</p>
                </div>
                <div className="space-y-1">
                  <Label>Parts Cost</Label>
                  <p className="font-medium">
                    ${item.partsUsed.reduce((sum, part) => sum + part.price * part.quantity, 0).toFixed(2)}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label>Labor Cost</Label>
                  <p className="font-medium">${item.laborCost.toFixed(2)}</p>
                </div>
                <div className="space-y-1">
                  <Label>Item Total Cost</Label>
                  <p className="font-medium">${item.itemTotalCost.toFixed(2)}</p>
                </div>
                <div className="space-y-1">
                  <Label>Estimated Time</Label>
                  <p className="font-medium">{item.estimatedTime}</p>
                </div>
              </div>
              {item.partsUsed && item.partsUsed.length > 0 && (
                <div className="space-y-1 text-sm text-gray-600 mt-4">
                  <p className="font-semibold">Parts Used:</p>
                  <ul className="list-disc pl-5">
                    {item.partsUsed.map((p, pIdx) => (
                      <li key={pIdx}>
                        {p.name} (x{p.quantity}) - ${p.price.toFixed(2)} each
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          ))}
        </CardContent>
      </Card>

      {isEditMode && formData && (
        <CreateRepairModal
          isOpen={isEditMode}
          onClose={() => setIsEditMode(false)}
          onSave={handleSaveRepair}
          initialData={{ ...formData, id: repair.id, customerName: repair.customer, customerPhone: customer?.phone }}
        />
      )}
    </div>
  )
}
