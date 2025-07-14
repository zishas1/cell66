"use client"

import React, { useState, useMemo } from "react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { mockCustomers } from "@/data/mock-customers"

interface Customer {
  id: string
  name: string
  email: string
  phone: string
}

interface CustomerSearchSelectProps {
  onCustomerSelect: (customer: Customer | null) => void
  selectedCustomer?: Customer | null
}

export function CustomerSearchSelect({
  onCustomerSelect,
  selectedCustomer: propSelectedCustomer,
}: CustomerSearchSelectProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(propSelectedCustomer || null)

  React.useEffect(() => {
    setSelectedCustomer(propSelectedCustomer || null)
  }, [propSelectedCustomer])

  const filteredCustomers = useMemo(() => {
    if (!searchTerm) return mockCustomers

    const lowerCaseSearchTerm = searchTerm.toLowerCase()
    return mockCustomers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        customer.email.toLowerCase().includes(lowerCaseSearchTerm) ||
        customer.phone.includes(lowerCaseSearchTerm),
    )
  }, [searchTerm])

  const handleSelect = (customer: Customer) => {
    setSelectedCustomer(customer)
    onCustomerSelect(customer)
    setOpen(false)
    setSearchTerm("") // Clear search term after selection
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-transparent"
        >
          {selectedCustomer ? (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {selectedCustomer.name} ({selectedCustomer.phone})
            </div>
          ) : (
            "Select customer..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Search customer..." value={searchTerm} onValueChange={setSearchTerm} />
          <CommandList>
            <CommandEmpty>No customer found.</CommandEmpty>
            <CommandGroup>
              {filteredCustomers.map((customer) => (
                <CommandItem
                  key={customer.id}
                  value={`${customer.name} ${customer.email} ${customer.phone}`}
                  onSelect={() => handleSelect(customer)}
                >
                  <Check
                    className={cn("mr-2 h-4 w-4", selectedCustomer?.id === customer.id ? "opacity-100" : "opacity-0")}
                  />
                  <div className="flex flex-col">
                    <span>{customer.name}</span>
                    <span className="text-xs text-muted-foreground">{customer.phone}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
