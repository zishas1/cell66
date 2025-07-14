"use client"

import { CardDescription } from "@/components/ui/card"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, PlusCircle, Headphones, Clock, AlertTriangle, CheckCircle } from "lucide-react"
import { CreateTicketModal } from "@/components/support/create-ticket-modal"
import { CustomerLookupModal } from "@/components/customers/customer-lookup-modal"
import { mockCustomers } from "@/data/mock-customers"
import { ViewTicketModal } from "@/components/support/view-ticket-modal" // Import the new modal

const mockTickets = [
  {
    id: "TKT001",
    subject: "Internet connectivity issue",
    customer: "John Doe",
    status: "Open",
    priority: "High",
    assignedTo: "Jane Smith",
    description: "Customer reports frequent disconnections and slow internet speeds.",
    created: "2023-10-20T10:00:00Z", // Added created field
    lastUpdated: "2023-10-20T11:30:00Z",
    customerId: "cust_001",
    messages: [
      { sender: "Customer", content: "My internet is not working.", timestamp: "2023-10-20T10:00:00Z" },
      { sender: "Jane Smith", content: "I'm looking into it now.", timestamp: "2023-10-20T11:30:00Z" },
    ],
  },
  {
    id: "TKT002",
    subject: "Billing inquiry",
    customer: "Jane Smith",
    status: "Closed",
    priority: "Medium",
    assignedTo: "Admin",
    description: "Customer has a question about their latest bill.",
    created: "2023-10-18T14:00:00Z", // Added created field
    lastUpdated: "2023-10-19T09:00:00Z",
    customerId: "cust_002",
    messages: [
      { sender: "Customer", content: "Can you explain my bill?", timestamp: "2023-10-18T14:00:00Z" },
      { sender: "Admin", content: "I've clarified the charges for you.", timestamp: "2023-10-19T09:00:00Z" },
    ],
  },
  {
    id: "TKT003",
    subject: "Device setup assistance",
    customer: "Bob Johnson",
    status: "Open",
    priority: "Low",
    assignedTo: "Jane Smith",
    description: "Customer needs help setting up their new phone.",
    created: "2023-10-22T09:00:00Z", // Added created field
    lastUpdated: "2023-10-22T09:00:00Z",
    customerId: "cust_003",
    messages: [{ sender: "Customer", content: "I need help with my new phone.", timestamp: "2023-10-22T09:00:00Z" }],
  },
  {
    id: "TKT004",
    subject: "Warranty claim for iPhone",
    customer: "Alice Brown",
    status: "Pending",
    priority: "High",
    assignedTo: "Admin",
    description: "Customer wants to claim warranty for a faulty iPhone.",
    created: "2023-10-15T16:00:00Z", // Added created field
    lastUpdated: "2023-10-23T10:00:00Z",
    customerId: "cust_004",
    messages: [
      { sender: "Customer", content: "My iPhone is not working.", timestamp: "2023-10-15T16:00:00Z" },
      { sender: "Admin", content: "We are reviewing your claim.", timestamp: "2023-10-23T10:00:00Z" },
    ],
  },
]

export default function SupportPage() {
  const [tickets, setTickets] = useState(mockTickets)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All Status")
  const [priorityFilter, setPriorityFilter] = useState("All Priority")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [showCustomerLookup, setShowCustomerLookup] = useState(false)
  const [isViewTicketModalOpen, setIsViewTicketModalOpen] = useState(false) // New state for view modal
  const [selectedTicket, setSelectedTicket] = useState<any>(null) // New state for selected ticket

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "All Status" || ticket.status === statusFilter
    const matchesPriority = priorityFilter === "All Priority" || ticket.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleCustomerClick = (customerName: string) => {
    const customer = mockCustomers.find((c) => c.name === customerName)
    if (customer) {
      setSelectedCustomer(customer)
      setShowCustomerLookup(true)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Open":
        return (
          <Badge variant="default">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Open
          </Badge>
        )
      case "Pending":
        return <Badge variant="secondary">Pending</Badge>
      case "Closed":
        return <Badge variant="outline">Closed</Badge>
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
    open: tickets.filter((t) => t.status === "Open").length,
    pending: tickets.filter((t) => t.status === "Pending").length,
    closed: tickets.filter((t) => t.status === "Closed").length,
    overdue: tickets.filter(
      (t) => t.status === "Open" && new Date(t.created) < new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    ).length,
  }

  const handleCreateTicket = (ticketData: any) => {
    console.log("Creating ticket:", ticketData)
    // In a real app, you'd send this to a backend
    setIsCreateModalOpen(false)
  }

  const handleViewTicket = (ticket: any) => {
    setSelectedTicket(ticket)
    setIsViewTicketModalOpen(true)
  }

  const handleReplyToTicket = (ticketId: string, message: string) => {
    console.log(`Replying to ticket ${ticketId}: ${message}`)
    // In a real app, send this to backend and update ticket messages
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              messages: [...ticket.messages, { sender: "You", content: message, timestamp: new Date().toISOString() }],
              lastUpdated: new Date().toISOString(),
            }
          : ticket,
      ),
    )
    // Optionally close modal or show success toast
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Support Tickets</h1>
          <p className="text-gray-600">Manage customer support requests</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="w-full sm:w-auto">
          <PlusCircle className="h-4 w-4 mr-2" />
          New Ticket
        </Button>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.open}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tickets</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Closed Tickets</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.closed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <Headphones className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overdue}</div>
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
                  placeholder="Search tickets by customer, subject, or ID..."
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
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
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
          </div>
        </CardContent>
      </Card>
      {/* Tickets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Support Tickets ({filteredTickets.length})</CardTitle>
          <CardDescription>Manage customer support requests and track resolution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="min-w-[800px] md:min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-mono">{ticket.id}</TableCell>
                    <TableCell>
                      {ticket.customerId ? (
                        <Link
                          href={`/dashboard/customers/${ticket.customerId}`}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          {ticket.customer}
                        </Link>
                      ) : (
                        <button
                          onClick={() => handleCustomerClick(ticket.customer)}
                          className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                        >
                          {ticket.customer}
                        </button>
                      )}
                    </TableCell>
                    <TableCell>{ticket.subject}</TableCell>
                    <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                    <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                    <TableCell>{ticket.assignedTo}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleViewTicket(ticket)}>
                          View
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleViewTicket(ticket)}>
                          Reply
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateTicket={handleCreateTicket}
      />
      <CustomerLookupModal open={showCustomerLookup} onOpenChange={setShowCustomerLookup} customer={selectedCustomer} />
      {selectedTicket && (
        <ViewTicketModal
          isOpen={isViewTicketModalOpen}
          onClose={() => setIsViewTicketModalOpen(false)}
          ticket={selectedTicket}
          onReply={handleReplyToTicket}
        />
      )}
    </div>
  )
}
