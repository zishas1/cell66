export type LineType = "new_line" | "transfer"
export type ServicePlan = "basic" | "standard" | "premium"
export type LineStatus =
  | "active"
  | "pending_activation"
  | "suspended"
  | "cancelled"
  | "cc_declined"
  | "notified_customer"
  | "cancel_requested"
  | "reactivated"

export interface ResellerCustomerLine {
  id: string
  customerId: string // Link to a mock customer or a new customer entry
  customerName: string
  customerEmail: string
  customerPhone: string
  simCardNumber: string
  lineType: LineType
  carrier?: string // Required if lineType is 'transfer'
  portPin?: string // Required if lineType is 'transfer'
  servicePlan: ServicePlan
  status: LineStatus
  ccLast4: string
  ccDeclinedCount: number
  lastAttemptDate?: string // Date of last CC decline attempt
  commissionEarned: number // Commission earned on this specific line
}

export interface Reseller {
  id: string
  name: string
  contactEmail: string
  contactPhone: string
  commissionRate: number // e.g., 0.10 for 10%
  status: "active" | "inactive"
  customers: ResellerCustomerLine[]
  logoUrl?: string // New: for reseller logo
  totalCommissionEarned: number // New: total commission earned by this reseller
}

export const mockResellers: Reseller[] = [
  {
    id: "RES001",
    name: "Mobile Connect",
    contactEmail: "contact@mobileconnect.com",
    contactPhone: "111-222-3333",
    commissionRate: 0.15,
    status: "active",
    logoUrl: "/placeholder.svg?height=64&width=64",
    totalCommissionEarned: 1250.75,
    customers: [
      {
        id: "LINE001",
        customerId: "CUST001",
        customerName: "Alice Wonderland",
        customerEmail: "alice@example.com",
        customerPhone: "555-100-0001",
        simCardNumber: "89014103211111111111",
        lineType: "new_line",
        servicePlan: "standard",
        status: "active",
        ccLast4: "1234",
        ccDeclinedCount: 0,
        commissionEarned: 15.0,
      },
      {
        id: "LINE002",
        customerId: "CUST002",
        customerName: "Bob The Builder",
        customerEmail: "bob@example.com",
        customerPhone: "555-100-0002",
        simCardNumber: "89014103211111111112",
        lineType: "transfer",
        carrier: "Verizon",
        portPin: "1234",
        servicePlan: "premium",
        status: "cc_declined",
        ccLast4: "5678",
        ccDeclinedCount: 2,
        lastAttemptDate: "2023-11-05",
        commissionEarned: 25.0,
      },
      {
        id: "LINE003",
        customerId: "CUST003",
        customerName: "Charlie Chaplin",
        customerEmail: "charlie@example.com",
        customerPhone: "555-100-0003",
        simCardNumber: "89014103211111111113",
        lineType: "new_line",
        servicePlan: "basic",
        status: "notified_customer",
        ccLast4: "9012",
        ccDeclinedCount: 1,
        lastAttemptDate: "2023-11-04",
        commissionEarned: 10.0,
      },
    ],
  },
  {
    id: "RES002",
    name: "Global Wireless",
    contactEmail: "support@globalwireless.net",
    contactPhone: "444-555-6666",
    commissionRate: 0.12,
    status: "active",
    logoUrl: "/placeholder.svg?height=64&width=64",
    totalCommissionEarned: 800.0,
    customers: [
      {
        id: "LINE004",
        customerId: "CUST004",
        customerName: "Diana Prince",
        customerEmail: "diana@example.com",
        customerPhone: "555-100-0004",
        simCardNumber: "89014103211111111114",
        lineType: "new_line",
        servicePlan: "standard",
        status: "active",
        ccLast4: "3456",
        ccDeclinedCount: 0,
        commissionEarned: 18.0,
      },
    ],
  },
]

export function getAllResellers(): Reseller[] {
  return mockResellers
}

export function getResellerById(id: string): Reseller | undefined {
  return mockResellers.find((reseller) => reseller.id === id)
}

export function addResellerCustomerLine(
  resellerId: string,
  newLineData: Omit<ResellerCustomerLine, "id" | "status" | "ccDeclinedCount" | "commissionEarned">,
): ResellerCustomerLine | undefined {
  const reseller = mockResellers.find((r) => r.id === resellerId)
  if (!reseller) return undefined

  const newId = `LINE${Date.now().toString().slice(-6)}`
  const newLine: ResellerCustomerLine = {
    id: newId,
    status: "pending_activation", // Default status for new lines
    ccDeclinedCount: 0,
    commissionEarned: calculateMockCommission(newLineData.servicePlan), // Mock commission
    ...newLineData,
  }
  reseller.customers.push(newLine)
  reseller.totalCommissionEarned += newLine.commissionEarned
  return newLine
}

export function updateResellerCustomerLine(
  lineId: string,
  updates: Partial<ResellerCustomerLine>,
): ResellerCustomerLine | undefined {
  for (const reseller of mockResellers) {
    const lineIndex = reseller.customers.findIndex((line) => line.id === lineId)
    if (lineIndex !== -1) {
      const updatedLine = { ...reseller.customers[lineIndex], ...updates }
      reseller.customers[lineIndex] = updatedLine
      return updatedLine
    }
  }
  return undefined
}

function calculateMockCommission(servicePlan: ServicePlan): number {
  switch (servicePlan) {
    case "basic":
      return 10.0
    case "standard":
      return 15.0
    case "premium":
      return 25.0
    default:
      return 0.0
  }
}
