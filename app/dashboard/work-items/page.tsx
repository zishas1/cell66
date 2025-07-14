"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, PlusCircle } from "lucide-react"
import { KanbanBoard } from "@/components/work-items/kanban-board"
import { CreateWorkItemModal } from "@/components/work-items/create-work-item-modal"
import { mockWorkItems, type WorkItem, type WorkItemStatus } from "@/data/mock-work-items"

export default function WorkItemsPage() {
  const [workItems, setWorkItems] = useState<WorkItem[]>(mockWorkItems)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("All Types")
  const [statusFilter, setStatusFilter] = useState("All Status")
  const [priorityFilter, setPriorityFilter] = useState("All Priority")
  const [assignedToFilter, setAssignedToFilter] = useState("All Assignees")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const filteredWorkItems = useMemo(() => {
    return workItems.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.customer && item.customer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesType = typeFilter === "All Types" || item.type === typeFilter
      const matchesStatus = statusFilter === "All Status" || item.status === statusFilter
      const matchesPriority = priorityFilter === "All Priority" || item.priority === priorityFilter
      const matchesAssignedTo = assignedToFilter === "All Assignees" || item.assignedTo === assignedToFilter

      return matchesSearch && matchesType && matchesStatus && matchesPriority && matchesAssignedTo
    })
  }, [workItems, searchTerm, typeFilter, statusFilter, priorityFilter, assignedToFilter])

  const handleCreateWorkItem = (newItemData: Omit<WorkItem, "id" | "createdAt" | "status">) => {
    const newId =
      newItemData.type === "task"
        ? `T${String(workItems.filter((i) => i.type === "task").length + 1).padStart(3, "0")}`
        : `S${String(workItems.filter((i) => i.type === "support_ticket").length + 1).padStart(3, "0")}`

    const initialStatus: WorkItemStatus = newItemData.type === "task" ? "To Do" : "Open"

    const newItem: WorkItem = {
      id: newId,
      createdAt: new Date().toISOString(),
      status: initialStatus,
      ...newItemData,
    }
    setWorkItems((prev) => [...prev, newItem])
    setIsCreateModalOpen(false)
  }

  const handleStatusChange = (id: string, newStatus: WorkItemStatus) => {
    setWorkItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: newStatus,
              // If moving to completed/closed, set due date to today if it's a task and not already set
              dueDate:
                item.type === "task" && (newStatus === "Completed" || newStatus === "Closed") && !item.dueDate
                  ? new Date().toISOString().split("T")[0]
                  : item.dueDate,
            }
          : item,
      ),
    )
  }

  const allAssignees = useMemo(() => {
    const assignees = new Set(mockWorkItems.map((item) => item.assignedTo))
    return ["All Assignees", "unassigned", ...Array.from(assignees).sort()]
  }, [])

  const allStatuses = useMemo(() => {
    const statuses = new Set(mockWorkItems.map((item) => item.status))
    return ["All Status", ...Array.from(statuses).sort()]
  }, [])

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Work Items (Tasks & Support)</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" /> Create New Item
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Types">All Types</SelectItem>
            <SelectItem value="task">Task</SelectItem>
            <SelectItem value="support_ticket">Support Ticket</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            {allStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Priority">All Priority</SelectItem>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={assignedToFilter} onValueChange={setAssignedToFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Assignee" />
          </SelectTrigger>
          <SelectContent>
            {allAssignees.map((assignee) => (
              <SelectItem key={assignee} value={assignee}>
                {assignee}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <KanbanBoard workItems={filteredWorkItems} onStatusChange={handleStatusChange} />

      <CreateWorkItemModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateWorkItem={handleCreateWorkItem}
      />
    </div>
  )
}
