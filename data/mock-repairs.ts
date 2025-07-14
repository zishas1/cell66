export interface RepairPricingPart {
  name: string
  quantity: number
  price: number
}

export interface RepairItem {
  id: string // Unique ID for each item within a repair ticket
  brand: string // e.g., "Apple", "Samsung"
  model: string // e.g., "iPhone 13 Pro Max", "Galaxy S22"
  issueDescription: string
  partsUsed: RepairPricingPart[]
  laborCost: number
  itemTotalCost: number // Cost for this specific item
  estimatedTime: string // New field for estimated time
}

export interface Repair {
  id: string
  customerId: string
  customer: string
  repairItems: RepairItem[] // Changed to an array of repair items
  status: "Pending" | "In Progress" | "Completed" | "Cancelled" | "Pending Parts" | "Pending Quote" | "Ready for Pickup"
  assignedTo: string
  priority: "High" | "Medium" | "Low"
  receivedDate: string
  estimatedCompletion: string
  notes: string
  totalCost: number // Overall total for all repair items
}

export const mockRepairs: Repair[] = [
  {
    id: "R001",
    customerId: "CUST001",
    customer: "John Doe",
    repairItems: [
      {
        id: "R001-ITEM001",
        brand: "Apple",
        model: "iPhone 13 Pro Max",
        issueDescription: "Cracked Screen",
        partsUsed: [{ name: "iPhone 13 Pro Max Screen Assembly", quantity: 1, price: 250.0 }],
        laborCost: 100.0,
        itemTotalCost: 350.0,
        estimatedTime: "1-2 hours",
      },
      {
        id: "R001-ITEM002",
        brand: "Apple",
        model: "iPhone 13 Pro Max",
        issueDescription: "Battery Replacement",
        partsUsed: [{ name: "iPhone 13 Pro Max Battery", quantity: 1, price: 75.0 }],
        laborCost: 50.0,
        itemTotalCost: 125.0,
        estimatedTime: "30-45 minutes",
      },
    ],
    status: "In Progress",
    assignedTo: "Technician A",
    priority: "High",
    receivedDate: "2023-10-20",
    estimatedCompletion: "2023-10-27",
    notes: "Customer reported device dropped. Screen has multiple cracks. Battery health at 70%.",
    totalCost: 475.0, // Sum of itemTotalCosts
  },
  {
    id: "R002",
    customerId: "CUST002",
    customer: "Jane Smith",
    repairItems: [
      {
        id: "R002-ITEM001",
        brand: "Samsung",
        model: "Galaxy S22",
        issueDescription: "Battery Replacement",
        partsUsed: [{ name: "OEM Battery", quantity: 1, price: 44.0 }],
        laborCost: 60.0,
        itemTotalCost: 104.0,
        estimatedTime: "45-60 minutes",
      },
    ],
    status: "Completed",
    assignedTo: "Technician B",
    priority: "Medium",
    receivedDate: "2023-10-10",
    estimatedCompletion: "2023-10-12",
    notes: "Battery replaced, device tested and working.",
    totalCost: 104.0,
  },
  {
    id: "R003",
    customerId: "CUST003",
    customer: "Bob Johnson",
    repairItems: [
      {
        id: "R003-ITEM001",
        brand: "Apple",
        model: "iPad Air",
        issueDescription: "Charging Port",
        partsUsed: [{ name: "iPad Air Charging Port", quantity: 1, price: 80.0 }],
        laborCost: 90.0,
        itemTotalCost: 170.0,
        estimatedTime: "2-3 hours",
      },
    ],
    status: "Pending Parts",
    assignedTo: "Technician A",
    priority: "High",
    receivedDate: "2023-11-01",
    estimatedCompletion: "2023-11-08",
    notes: "Charging port damaged, part ordered.",
    totalCost: 170.0,
  },
  {
    id: "R004",
    customerId: "CUST004",
    customer: "Alice Brown",
    repairItems: [
      {
        id: "R004-ITEM001",
        brand: "Google",
        model: "Pixel 7",
        issueDescription: "Water Damage",
        partsUsed: [],
        laborCost: 0.0,
        itemTotalCost: 0.0,
        estimatedTime: "2-3 days (diagnostic)",
      },
    ],
    status: "Pending Quote",
    assignedTo: "Unassigned",
    priority: "Low",
    receivedDate: "2023-11-05",
    estimatedCompletion: "2023-11-10",
    notes: "Device submerged in water. Needs full diagnostic and quote.",
    totalCost: 0.0,
  },
]

export function getAllRepairs() {
  return mockRepairs
}

export function updateRepairStatus(id: string, newStatus: Repair["status"]) {
  const repairIndex = mockRepairs.findIndex((repair) => repair.id === id)
  if (repairIndex !== -1) {
    mockRepairs[repairIndex].status = newStatus
    return true
  }
  return false
}
