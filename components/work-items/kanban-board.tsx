"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, CheckCircle, Clock, Headphones, ListTodo, User, AlertTriangle } from "lucide-react"
import { type WorkItem, type WorkItemStatus, kanbanColumns } from "@/data/mock-work-items"
import Link from "next/link"

interface KanbanBoardProps {
  workItems: WorkItem[]
  onStatusChange: (id: string, newStatus: WorkItemStatus) => void
}

export function KanbanBoard({ workItems, onStatusChange }: KanbanBoardProps) {
  const [draggingItem, setDraggingItem] = useState<WorkItem | null>(null)

  const handleDragStart = (e: React.DragEvent, item: WorkItem) => {
    setDraggingItem(item)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", item.id)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, targetStatus: WorkItemStatus) => {
    e.preventDefault()
    if (draggingItem) {
      onStatusChange(draggingItem.id, targetStatus)
      setDraggingItem(null)
    }
  }

  const getStatusBadge = (status: WorkItemStatus) => {
    switch (status) {
      case "To Do":
      case "Open":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <ListTodo className="h-3 w-3 mr-1" /> {status}
          </Badge>
        )
      case "In Progress":
        return (
          <Badge variant="default" className="bg-yellow-100 text-yellow-800">
            <Clock className="h-3 w-3 mr-1" /> {status}
          </Badge>
        )
      case "Pending Review":
      case "Pending":
        return (
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            <Clock className="h-3 w-3 mr-1" /> {status}
          </Badge>
        )
      case "Completed":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" /> {status}
          </Badge>
        )
      case "Closed":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            <CheckCircle className="h-3 w-3 mr-1" /> {status}
          </Badge>
        )
      case "Overdue":
        return (
          <Badge variant="destructive">
            <AlertTriangle className="h-3 w-3 mr-1" /> {status}
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: "Low" | "Medium" | "High") => {
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

  return (
    <div className="flex flex-nowrap overflow-x-auto gap-4 p-4">
      {kanbanColumns.map((column) => (
        <Card
          key={column.id}
          className="flex-shrink-0 w-80 bg-gray-50 dark:bg-gray-800"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, column.statuses[0] as WorkItemStatus)} // Drop to the first status in the column
        >
          <CardHeader className="border-b p-4">
            <CardTitle className="text-lg font-semibold">{column.title}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3 min-h-[100px]">
            {workItems
              .filter((item) => column.statuses.includes(item.status))
              .map((item) => (
                <Card
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  className="cursor-grab active:cursor-grabbing bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-3 space-y-2">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        {item.type === "task" ? <ListTodo className="h-4 w-4" /> : <Headphones className="h-4 w-4" />}
                        <span className="font-mono text-xs">{item.id}</span>
                      </div>
                      {getPriorityBadge(item.priority)}
                    </div>
                    <h3 className="font-medium text-base">{item.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{item.assignedTo}</span>
                      </div>
                      {item.dueDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Due: {item.dueDate}</span>
                        </div>
                      )}
                      {item.customer && (
                        <Link
                          href={`/dashboard/customers/${item.customer.id}`}
                          className="flex items-center gap-1 text-blue-600 hover:underline"
                        >
                          <User className="h-3 w-3" />
                          <span>{item.customer.name}</span>
                        </Link>
                      )}
                    </div>
                    <div className="flex justify-end">{getStatusBadge(item.status)}</div>
                  </CardContent>
                </Card>
              ))}
            {workItems.filter((item) => column.statuses.includes(item.status)).length === 0 && (
              <p className="text-center text-muted-foreground text-sm py-4">No items in this column.</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
