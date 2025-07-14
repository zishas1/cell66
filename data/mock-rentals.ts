export interface RentalItem {
  name: string
  quantity: number
  rate: number
  requiresService?: boolean
  country?: string
  servicePlan?: string
}

export interface RentalDetails {
  id: string
  customerId: string
  customerName: string
  customerPhone: string
  items: RentalItem[] // Changed to array of RentalItem
  rentalRate: number // This will now be the sum of all item rates
  rentalPeriod: "Daily" | "Weekly" | "Monthly"
  startDate: string
  endDate: string
  status: "Active" | "Completed" | "Overdue" | "Cancelled" | "Pending"
  totalCost: number
  notes: string
  staffRepId?: string // New: Staff representative ID
  staffRepName?: string // New: Staff representative Name
  depositAmount?: number // New: Deposit amount
  lateFees?: number // New: Late fees accrued
}

export const mockRentals: RentalDetails[] = [
  {
    id: "RENT001",
    customerId: "CUST001",
    customerName: "John Doe",
    customerPhone: "(555) 123-4567",
    items: [{ name: "iPad Pro 12.9 inch", quantity: 1, rate: 25.0 }],
    rentalRate: 25.0,
    rentalPeriod: "Daily",
    startDate: "2023-10-20",
    endDate: "2023-10-27",
    status: "Completed",
    totalCost: 175.0,
    notes: "Returned on time, device in good condition.",
    staffRepId: "SALES001",
    staffRepName: "Jane Smith",
    depositAmount: 50.0,
    lateFees: 0.0,
  },
  {
    id: "RENT002",
    customerId: "CUST002",
    customerName: "Jane Smith",
    customerPhone: "(555) 987-6543",
    items: [
      { name: "Projector", quantity: 1, rate: 50.0 },
      {
        name: "Portable Hotspot",
        quantity: 1,
        rate: 10.0,
        requiresService: true,
        country: "USA",
        servicePlan: "Unlimited Data",
      },
    ],
    rentalRate: 60.0, // 50 + 10
    rentalPeriod: "Daily",
    startDate: "2023-11-01",
    endDate: "2023-11-03",
    status: "Active",
    totalCost: 180.0, // 60 * 3 days
    notes: "Customer picked up, confirmed working.",
    staffRepId: "SALES002",
    staffRepName: "John Doe",
    depositAmount: 100.0,
    lateFees: 0.0,
  },
  {
    id: "RENT003",
    customerId: "CUST003",
    customerName: "Bob Johnson",
    customerPhone: "(555) 555-1234",
    items: [
      {
        name: "Portable Hotspot",
        quantity: 1,
        rate: 10.0,
        requiresService: true,
        country: "Canada",
        servicePlan: "5GB Plan",
      },
    ],
    rentalRate: 10.0,
    rentalPeriod: "Weekly",
    startDate: "2023-10-01",
    endDate: "2023-10-08", // This one is overdue
    status: "Overdue",
    totalCost: 70.0,
    notes: "Customer has not returned, sent reminder.",
    staffRepId: "SALES001",
    staffRepName: "Jane Smith",
    depositAmount: 20.0,
    lateFees: 10.0,
  },
  {
    id: "RENT004",
    customerId: "CUST004",
    customerName: "Alice Brown",
    customerPhone: "(555) 111-2222",
    items: [{ name: "Laptop", quantity: 1, rate: 75.0 }],
    rentalRate: 75.0,
    rentalPeriod: "Monthly",
    startDate: "2023-11-10",
    endDate: "", // Ongoing
    status: "Active",
    totalCost: 75.0,
    notes: "Long-term rental for business client.",
    staffRepId: "SALES002",
    staffRepName: "John Doe",
    depositAmount: 150.0,
    lateFees: 0.0,
  },
]

export function getAllRentals(): RentalDetails[] {
  return mockRentals
}

export function getRentalById(id: string): RentalDetails | undefined {
  return mockRentals.find((rental) => rental.id === id)
}

export function addRental(
  newRental: Omit<RentalDetails, "id" | "status" | "totalCost" | "lateFees" | "rentalRate">,
): RentalDetails {
  const id = `RENT${Date.now()}`
  const status = "Active" // Default status for new rentals
  const rentalRate = newRental.items.reduce((sum, item) => sum + item.rate * item.quantity, 0)
  const totalCost = rentalRate // Simplified for mock, would be calculated based on period in real app
  const lateFees = 0.0
  const rental = { id, status, totalCost, lateFees, rentalRate, ...newRental }
  mockRentals.push(rental)
  return rental
}

export function updateRental(id: string, updates: Partial<RentalDetails>): RentalDetails | undefined {
  const index = mockRentals.findIndex((rental) => rental.id === id)
  if (index !== -1) {
    const updatedRental = { ...mockRentals[index], ...updates }
    // Recalculate rentalRate if items are updated
    if (updates.items) {
      updatedRental.rentalRate = updates.items.reduce((sum, item) => sum + item.rate * item.quantity, 0)
    }
    mockRentals[index] = updatedRental
    return updatedRental
  }
  return undefined
}
