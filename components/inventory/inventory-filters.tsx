"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

interface InventoryFiltersProps {
  onFiltersChange: (filters: { searchTerm: string; category: string; carrier: string; stockStatus: string }) => void
}

export function InventoryFilters({ onFiltersChange }: InventoryFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("all")
  const [carrier, setCarrier] = useState("all")
  const [stockStatus, setStockStatus] = useState("all")

  const handleApplyFilters = () => {
    onFiltersChange({ searchTerm, category, carrier, stockStatus })
  }

  const handleClearFilters = () => {
    setSearchTerm("")
    setCategory("all")
    setCarrier("all")
    setStockStatus("all")
    onFiltersChange({ searchTerm: "", category: "all", carrier: "all", stockStatus: "all" })
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search products..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger>
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="smartphones">Smartphones</SelectItem>
          <SelectItem value="accessories">Accessories</SelectItem>
          <SelectItem value="activations">Activations</SelectItem>
          <SelectItem value="repairs">Repairs</SelectItem>
          <SelectItem value="rentals">Rentals</SelectItem>
        </SelectContent>
      </Select>
      <Select value={carrier} onValueChange={setCarrier}>
        <SelectTrigger>
          <SelectValue placeholder="Carrier" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Carriers</SelectItem>
          <SelectItem value="unlocked">Unlocked</SelectItem>
          <SelectItem value="verizon">Verizon</SelectItem>
          <SelectItem value="att">AT&T</SelectItem>
          <SelectItem value="tmobile">T-Mobile</SelectItem>
        </SelectContent>
      </Select>
      <Select value={stockStatus} onValueChange={setStockStatus}>
        <SelectTrigger>
          <SelectValue placeholder="Stock Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Stock</SelectItem>
          <SelectItem value="in-stock">In Stock</SelectItem>
          <SelectItem value="low-stock">Low Stock</SelectItem>
          <SelectItem value="out-of-stock">Out of Stock</SelectItem>
        </SelectContent>
      </Select>
      <div className="col-span-full flex justify-end gap-2">
        <Button variant="outline" onClick={handleClearFilters}>
          <X className="h-4 w-4 mr-2" /> Clear Filters
        </Button>
        <Button onClick={handleApplyFilters}>Apply Filters</Button>
      </div>
    </div>
  )
}
