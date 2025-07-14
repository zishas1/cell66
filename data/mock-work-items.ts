import type { Customer } from "@/data/mock-customers"

export type WorkItemType = "task" | "support_ticket"
export type WorkItemStatus =
  | "To Do"
  | "In Progress"
  | "Pending Review"
  | "Completed"
  | "Closed"
  | "Overdue"
  | "Open" // Specific to tickets, but can map to "To Do" or "In Progress"
  | "Pending" // Specific to tickets, can map to "Pending Review"
  | "Archived" // For items that are done and no longer active

export interface WorkItem {
  id: string
  type: WorkItemType
  title: string
  description: string
  status: WorkItemStatus
  priority: "Low" | "Medium" | "High"
  assignedTo: string
  dueDate?: string // For tasks
  createdAt: string
  customer?: Customer // For support tickets
}

export const mockWorkItems: WorkItem[] = [
  // Mock Tasks
  {
    id: "T001",
    type: "task",
    title: "Order new iPhone 15 stock",
    description: "Check inventory levels and place order for iPhone 15 Pro Max and regular models.",
    assignedTo: "John Doe",
    dueDate: "2023-11-05",
    status: "To Do",
    priority: "High",
    createdAt: "2023-10-20T10:00:00Z",
  },
  {
    id: "T002",
    type: "task",
    title: "Clean display cases",
    description: "Ensure all glass display cases are spotless and products are neatly arranged.",
    assignedTo: "Admin",
    dueDate: "2023-10-27",
    status: "Completed",
    priority: "Medium",
    createdAt: "2023-10-25T14:30:00Z",
  },
  {
    id: "T003",
    type: "task",
    title: "Prepare Q4 sales report",
    description: "Compile all sales data for Q4 and generate a comprehensive report for management.",
    assignedTo: "John Doe",
    dueDate: "2023-11-10",
    status: "In Progress",
    priority: "High",
    createdAt: "2023-10-28T09:00:00Z",
  },
  {
    id: "T004",
    type: "task",
    title: "Update POS software",
    description: "Install the latest version of the POS software on all terminals.",
    assignedTo: "Jane Smith",
    dueDate: "2023-11-01",
    status: "Overdue",
    priority: "High",
    createdAt: "2023-10-26T11:00:00Z",
  },
  {
    id: "T005",
    type: "task",
    title: "Review employee performance",
    description: "Conduct quarterly performance reviews for all sales representatives.",
    assignedTo: "Admin",
    dueDate: "2023-11-15",
    status: "To Do",
    priority: "Medium",
    createdAt: "2023-11-01T16:00:00Z",
  },

  // Mock Support Tickets
  {
    id: "S001",
    type: "support_ticket",
    title: "Internet connectivity issue",
    description: "Customer reports intermittent internet connection on their new 5G home internet device.",
    assignedTo: "Jane Smith",
    status: "Open",
    priority: "High",
    createdAt: "2023-10-29T09:15:00Z",
    customer: {
      id: "C001",
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "555-123-4567",
      address: "123 Main St, Anytown, USA",
      loyaltyPoints: 150,
      lastPurchaseDate: "2023-10-20",
      totalSpent: 1200,
      notes: "Prefers email communication.",
    },
  },
  {
    id: "S002",
    type: "support_ticket",
    title: "Billing inquiry",
    description: "Customer has questions about their latest monthly bill and data usage.",
    assignedTo: "Admin",
    status: "Closed",
    priority: "Medium",
    createdAt: "2023-10-25T11:00:00Z",
    customer: {
      id: "C002",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "555-987-6543",
      address: "456 Oak Ave, Anytown, USA",
      loyaltyPoints: 300,
      lastPurchaseDate: "2023-09-15",
      totalSpent: 2500,
      notes: "Always asks for discounts.",
    },
  },
  {
    id: "S003",
    type: "support_ticket",
    title: "Device setup assistance",
    description: "Customer needs help setting up their new Android phone and transferring data.",
    assignedTo: "Jane Smith",
    status: "Open",
    priority: "Low",
    createdAt: "2023-10-30T15:00:00Z",
    customer: {
      id: "C003",
      name: "Bob Johnson",
      email: "bob.johnson@example.com",
      phone: "555-555-1212",
      address: "789 Pine Ln, Anytown, USA",
      loyaltyPoints: 50,
      lastPurchaseDate: "2023-10-01",
      totalSpent: 500,
      notes: "New customer.",
    },
  },
  {
    id: "S004",
    type: "support_ticket",
    title: "Warranty claim for iPhone",
    description: "Customer's iPhone 13 Pro is experiencing battery drain issues under warranty.",
    assignedTo: "Admin",
    status: "Pending",
    priority: "High",
    createdAt: "2023-10-28T10:00:00Z",
    customer: {
      id: "C004",
      name: "Alice Brown",
      email: "alice.brown@example.com",
      phone: "555-333-2222",
      address: "101 Elm St, Anytown, USA",
      loyaltyPoints: 400,
      lastPurchaseDate: "2023-08-20",
      totalSpent: 3000,
      notes: "VIP customer.",
    },
  },
]

export const kanbanColumns = [
  { id: "to-do", title: "To Do", statuses: ["To Do", "Open"] },
  { id: "in-progress", title: "In Progress", statuses: ["In Progress"] },
  { id: "pending-review", title: "Pending Review", statuses: ["Pending Review", "Pending"] },
  { id: "completed", title: "Completed", statuses: ["Completed"] },
  { id: "closed", title: "Closed", statuses: ["Closed"] },
  { id: "overdue", title: "Overdue", statuses: ["Overdue"] },
]
