import { v4 as uuidv4 } from "uuid"

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  loyaltyPoints?: number
  notes?: string
  role: "admin" | "sales_rep" | "reseller" | "technician" | "support_agent" | "customer"
}

export const mockCustomers: Customer[] = [
  {
    id: "cust-admin-1",
    name: "Admin User",
    email: "admin@example.com",
    phone: "555-111-2222",
    address: "123 Admin St, Adminville",
    role: "admin",
    loyaltyPoints: 1000,
  },
  {
    id: "cust-sales-1",
    name: "Sales Rep User",
    email: "sales@example.com",
    phone: "555-333-4444",
    address: "456 Sales Ave, Salesburg",
    role: "sales_rep",
    loyaltyPoints: 200,
  },
  {
    id: "cust-reseller-1",
    name: "Reseller Partner",
    email: "reseller@example.com",
    phone: "555-555-6666",
    address: "789 Reseller Rd, Resellerton",
    role: "reseller",
    loyaltyPoints: 500,
  },
  {
    id: "cust-tech-1",
    name: "Technician User",
    email: "tech@example.com",
    phone: "555-777-8888",
    address: "101 Tech Ln, Tech City",
    role: "technician",
    loyaltyPoints: 50,
  },
  {
    id: "cust-support-1",
    name: "Support Agent User",
    email: "support@example.com",
    phone: "555-999-0000",
    address: "202 Help Desk Blvd, Supportville",
    role: "support_agent",
    loyaltyPoints: 100,
  },
  {
    id: "cust-customer-1",
    name: "Alice Smith",
    email: "alice@example.com",
    phone: "555-123-4567",
    address: "123 Main St, Anytown",
    role: "customer",
    loyaltyPoints: 350,
  },
  {
    id: "cust-customer-2",
    name: "Bob Johnson",
    email: "bob@example.com",
    phone: "555-987-6543",
    address: "456 Oak Ave, Somewhere",
    role: "customer",
    loyaltyPoints: 150,
  },
  {
    id: "cust-customer-3",
    name: "Charlie Brown",
    email: "charlie@example.com",
    phone: "555-555-1212",
    address: "789 Pine Ln, Nowhere",
    role: "customer",
    loyaltyPoints: 50,
  },
]

// Mock function to add a new customer
export const addCustomer = (customerData: Omit<Customer, "id" | "loyaltyPoints" | "role">): Customer => {
  const newCustomer: Customer = {
    id: uuidv4(),
    loyaltyPoints: 0,
    role: "customer", // Default role for new customers
    ...customerData,
  }
  mockCustomers.push(newCustomer) // In a real app, this would update a database
  return newCustomer
}

// Mock function to update a customer
export const updateCustomer = (updatedCustomer: Customer): Customer | undefined => {
  const index = mockCustomers.findIndex((c) => c.id === updatedCustomer.id)
  if (index !== -1) {
    mockCustomers[index] = updatedCustomer
    return mockCustomers[index]
  }
  return undefined
}

// Mock function to delete a customer
export const deleteCustomer = (customerId: string): boolean => {
  const initialLength = mockCustomers.length
  const updatedCustomers = mockCustomers.filter((c) => c.id !== customerId)
  mockCustomers.splice(0, mockCustomers.length, ...updatedCustomers) // Update the original array
  return mockCustomers.length < initialLength
}

// Mock function to update user role
export const updateUserRole = (userId: string, newRole: Customer["role"]): Customer | undefined => {
  const user = mockCustomers.find((c) => c.id === userId)
  if (user) {
    user.role = newRole
    return user
  }
  return undefined
}

// Mock function to update user permission overrides
export const updateUserPermissionOverrides = (
  userId: string,
  overrides: Record<string, boolean>,
): Customer | undefined => {
  const user = mockCustomers.find((c) => c.id === userId)
  if (user) {
    // In a real application, you would merge or replace specific permission overrides
    // For this mock, we'll just add a 'permissions' property if it doesn't exist
    // and then update it. This is a simplified representation.
    ;(user as any).permissions = { ...(user as any).permissions, ...overrides }
    return user
  }
  return undefined
}
