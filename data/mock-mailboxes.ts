import { v4 as uuidv4 } from "uuid"
import { mockCustomers } from "./mock-customers" // Ensure this import is correct

export interface Mailbox {
  id: string
  number: string
  isAvailable: boolean
  currentRentalId?: string
}

export interface MailboxRental {
  id: string
  customerId: string
  customerName: string
  mailboxNumber: string
  rentalRate: number
  rentalPeriod: "monthly" | "quarterly" | "annually"
  startDate: string
  endDate?: string // Made optional
  status: "active" | "expired" | "pending" | "cancelled"
  notes?: string
}

export const initialMailboxes: Mailbox[] = [
  { id: "mb1", number: "101", isAvailable: true },
  { id: "mb2", number: "102", isAvailable: false, currentRentalId: "mr1" },
  { id: "mb3", number: "103", isAvailable: true },
  { id: "mb4", number: "104", isAvailable: false, currentRentalId: "mr2" },
  { id: "mb5", number: "105", isAvailable: true },
  { id: "mb6", number: "106", isAvailable: true },
  { id: "mb7", number: "107", isAvailable: true },
  { id: "mb8", number: "108", isAvailable: false, currentRentalId: "mr3" },
  { id: "mb9", number: "109", isAvailable: true },
  { id: "mb10", number: "110", isAvailable: true },
]

export const initialMailboxRentals: MailboxRental[] = [
  {
    id: "mr1",
    customerId: mockCustomers[0].id,
    customerName: mockCustomers[0].name,
    mailboxNumber: "102",
    rentalRate: 25,
    rentalPeriod: "monthly",
    startDate: "2023-01-01",
    endDate: "2024-01-01",
    status: "active",
    notes: "Paid annually",
  },
  {
    id: "mr2",
    customerId: mockCustomers[1].id,
    customerName: mockCustomers[1].name,
    mailboxNumber: "104",
    rentalRate: 70,
    rentalPeriod: "quarterly",
    startDate: "2023-03-15",
    endDate: "2024-03-15",
    status: "active",
    notes: "Auto-renew",
  },
  {
    id: "mr3",
    customerId: mockCustomers[2].id,
    customerName: mockCustomers[2].name,
    mailboxNumber: "108",
    rentalRate: 30,
    rentalPeriod: "monthly",
    startDate: "2024-05-01",
    endDate: undefined, // Example of an ongoing rental
    status: "active",
    notes: "Ongoing rental, no fixed end date.",
  },
]

// Mock function to add a new mailbox
export const addMailbox = (number: string): Mailbox => {
  const newMailbox: Mailbox = {
    id: uuidv4(),
    number,
    isAvailable: true,
  }
  initialMailboxes.push(newMailbox) // In a real app, this would update a database
  return newMailbox
}

// Mock function to update mailbox availability
export const updateMailboxAvailability = (mailboxNumber: string, isAvailable: boolean, rentalId?: string) => {
  const mailbox = initialMailboxes.find((mb) => mb.number === mailboxNumber)
  if (mailbox) {
    mailbox.isAvailable = isAvailable
    mailbox.currentRentalId = rentalId
  }
}

// Mock function to add a new mailbox rental
export const addMailboxRental = (rentalData: Omit<MailboxRental, "id" | "status">): MailboxRental => {
  const newRental: MailboxRental = {
    id: uuidv4(),
    ...rentalData,
    status: "active", // Default status for new rentals
  }
  initialMailboxRentals.push(newRental)
  updateMailboxAvailability(newRental.mailboxNumber, false, newRental.id) // Mark mailbox as unavailable
  return newRental
}

// Export for convenience
export const mockMailboxes = initialMailboxes
export const mockMailboxRentals = initialMailboxRentals
