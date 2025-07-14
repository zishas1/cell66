"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, PlusCircle, Wrench, Clock, CheckCircle } from "lucide-react"
import { CreateRepairModal } from "@/components/repairs/create-repair-modal"
import { getAllRepairs, updateRepairStatus, type RepairDetails } from "@/data/mock-repairs"
import { mockCustomers } from "@/data/mock-customers"
import { CustomerLookupModal } from "@/components/customers/customer-lookup-modal"
import { initialPricingTemplates } from "@/data/mock-pricing-templates" // Corrected import

export default function RepairsPage() {
  const [repairs, setRepairs] = useState<RepairDetails[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All Status")
  const [priorityFilter, setPriorityFilter] = useState("All Priority")
  const [assignedToFilter, setAssignedToFilter] = useState("All Technicians")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [showCustomerLookup, setShowCustomerLookup] = useState(false)

  useEffect(() => {
    setRepairs(getAllRepairs())
  }, [])

  const filteredRepairs = repairs.filter((repair) => {
    const matchesSearch =
      repair.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repair.deviceBrand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repair.deviceModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repair.issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repair.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "All Status" || repair.status === statusFilter
    const matchesPriority = priorityFilter === "All Priority" || repair.priority === priorityFilter
    const matchesAssignedTo = assignedToFilter === "All Technicians" || repair.assignedToName === assignedToFilter
    return matchesSearch && matchesStatus && matchesPriority && matchesAssignedTo
  })

  const handleCustomerClick = (customerId: string) => {
    const customer = mockCustomers.find((c) => c.id === customerId)
    if (customer) {
      setSelectedCustomer(customer)
      setShowCustomerLookup(true)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return <Badge variant="secondary">Pending</Badge>
      case "In Progress":
        return <Badge variant="default">In Progress</Badge>
      case "Completed":
        return <Badge variant="success">Completed</Badge>
      case "On Hold":
        return <Badge variant="warning">On Hold</Badge>
      case "Cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
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
        return <Badge variant="secondary">{priority}</Badge>
    }
  }

  const stats = {
    pending: repairs.filter((r) => r.status === "Pending").length,
    inProgress: repairs.filter((r) => r.status === "In Progress").length,
    completed: repairs.filter((r) => r.status === "Completed").length,
    onHold: repairs.filter((r) => r.status === "On Hold").length,
  }

  const handleCreateRepair = (repairData: RepairDetails) => {
    console.log("Creating repair:", repairData)
    // In a real app, you'd send this to a backend
    setRepairs((prev) => [...prev, repairData])
    setIsCreateModalOpen(false)
  }

  const handleUpdateStatus = (repairId: string, newStatus: RepairDetails["status"]) => {
    const updated = updateRepairStatus(repairId, newStatus)
    if (updated) {
      setRepairs(getAllRepairs()) // Refresh the list
      // Optionally show a toast notification
    }
  }

  const mockRepairTechs = mockCustomers.filter((c) => c.role === "technician" || c.role === "admin")

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Repairs</h1>
          <p className="text-gray-600">Manage device repairs and track their progress</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="w-full sm:w-auto">
          <PlusCircle className="h-4 w-4 mr-2" />
          New Repair
        </Button>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Repairs</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Repairs</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Hold</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.onHold}</div>
          </CardContent>
        </Card>
      </div>
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search repairs by customer, device, issue, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Status">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="On Hold">On Hold</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Priority">All Priority</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={assignedToFilter} onValueChange={setAssignedToFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Assigned To" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Technicians">All Technicians</SelectItem>
                {mockRepairTechs.map((tech) => (
                  <SelectItem key={tech.id} value={tech.name}>
                    {tech.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      {/* Repairs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Repairs ({filteredRepairs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="min-w-[1000px] md:min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Repair ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Issue</TableHead>
                  <TableHead>Est. Cost</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRepairs.map((repair) => (
                  <TableRow key={repair.id}>
                    <TableCell className="font-mono">{repair.id}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleCustomerClick(repair.customerId)}
                        className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                      >
                        {repair.customerName}
                      </button>
                    </TableCell>
                    <TableCell>
                      {repair.deviceBrand} {repair.deviceModel}
                    </TableCell>
                    <TableCell>{repair.issue}</TableCell>
                    <TableCell>${repair.estimatedCost.toFixed(2)}</TableCell>
                    <TableCell>{repair.assignedToName || "Unassigned"}</TableCell>
                    <TableCell>{getPriorityBadge(repair.priority)}</TableCell>
                    <TableCell>{getStatusBadge(repair.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link href={`/dashboard/repairs/${repair.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                        {repair.status === "Pending" && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleUpdateStatus(repair.id, "In Progress")}
                          >
                            Start
                          </Button>
                        )}
                        {repair.status === "In Progress" && (
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleUpdateStatus(repair.id, "Completed")}
                          >
                            Complete
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <CreateRepairModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateRepair}
        pricingTemplates={initialPricingTemplates} // Pass the correct prop
      />
      <CustomerLookupModal open={showCustomerLookup} onOpenChange={setShowCustomerLookup} customer={selectedCustomer} />
    </div>
  )
}
