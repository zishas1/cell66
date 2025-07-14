"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, Save, Trash2 } from "lucide-react"
import {
  type DefaultRepairPrice,
  type DefaultRepairPart,
  mockBrands,
  mockIssues,
  getModelsByBrand,
} from "@/data/mock-default-repair-pricing"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DefaultPricingTableProps {
  initialPrices: DefaultRepairPrice[]
  onSave: (updatedPrices: DefaultRepairPrice[]) => void
}

export function DefaultPricingTable({ initialPrices, onSave }: DefaultPricingTableProps) {
  const [prices, setPrices] = useState<DefaultRepairPrice[]>(initialPrices)

  const handleFieldChange = (id: string, field: keyof DefaultRepairPrice, value: any) => {
    setPrices((prev) => prev.map((price) => (price.id === id ? { ...price, [field]: value } : price)))
  }

  const handlePartChange = (priceId: string, partIndex: number, field: keyof DefaultRepairPart, value: any) => {
    setPrices((prev) =>
      prev.map((price) => {
        if (price.id === priceId) {
          const updatedParts = [...price.defaultParts]
          if (updatedParts[partIndex]) {
            updatedParts[partIndex] = { ...updatedParts[partIndex], [field]: value }
          }
          return { ...price, defaultParts: updatedParts }
        }
        return price
      }),
    )
  }

  const handleAddPart = (priceId: string) => {
    setPrices((prev) =>
      prev.map((price) =>
        price.id === priceId
          ? { ...price, defaultParts: [...price.defaultParts, { name: "", quantity: 1, price: 0 }] }
          : price,
      ),
    )
  }

  const handleRemovePart = (priceId: string, partIndex: number) => {
    setPrices((prev) =>
      prev.map((price) =>
        price.id === priceId
          ? { ...price, defaultParts: price.defaultParts.filter((_, idx) => idx !== partIndex) }
          : price,
      ),
    )
  }

  const handleAddRow = () => {
    setPrices((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        brand: "",
        model: "",
        issue: "",
        defaultParts: [],
        defaultLaborCost: 0,
        defaultEstimatedTime: "",
      },
    ])
  }

  const handleRemoveRow = (id: string) => {
    setPrices((prev) => prev.filter((price) => price.id !== id))
  }

  const handleSave = () => {
    onSave(prices)
    alert("Default pricing updated!")
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <Button onClick={handleAddRow} variant="outline">
          <PlusCircle className="h-4 w-4 mr-2" /> Add New Price Rule
        </Button>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" /> Save All Changes
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Brand</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Issue</TableHead>
            <TableHead>Default Parts</TableHead>
            <TableHead>Labor Cost</TableHead>
            <TableHead>Est. Time</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prices.map((priceRule) => (
            <TableRow key={priceRule.id}>
              <TableCell>
                <Select
                  value={priceRule.brand}
                  onValueChange={(value) => handleFieldChange(priceRule.id, "brand", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockBrands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {priceRule.brand === "Other" && (
                  <Input
                    value={priceRule.brand}
                    onChange={(e) => handleFieldChange(priceRule.id, "brand", e.target.value)}
                    placeholder="Custom brand"
                    className="mt-1"
                  />
                )}
              </TableCell>
              <TableCell>
                <Select
                  value={priceRule.model}
                  onValueChange={(value) => handleFieldChange(priceRule.id, "model", value)}
                  disabled={!priceRule.brand || priceRule.brand === "Other"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    {priceRule.brand && priceRule.brand !== "Other" ? (
                      getModelsByBrand(priceRule.brand).map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="" disabled>
                        Select a brand first
                      </SelectItem>
                    )}
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {priceRule.model === "Other" && (
                  <Input
                    value={priceRule.model}
                    onChange={(e) => handleFieldChange(priceRule.id, "model", e.target.value)}
                    placeholder="Custom model"
                    className="mt-1"
                  />
                )}
              </TableCell>
              <TableCell>
                <Select
                  value={priceRule.issue}
                  onValueChange={(value) => handleFieldChange(priceRule.id, "issue", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select issue" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockIssues.map((issue) => (
                      <SelectItem key={issue} value={issue}>
                        {issue}
                      </SelectItem>
                    ))}
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {priceRule.issue === "Other" && (
                  <Textarea
                    value={priceRule.issue}
                    onChange={(e) => handleFieldChange(priceRule.id, "issue", e.target.value)}
                    placeholder="Custom issue description"
                    className="mt-1"
                  />
                )}
              </TableCell>
              <TableCell>
                {priceRule.defaultParts.map((part, idx) => (
                  <div key={idx} className="flex items-center gap-1 mb-1">
                    <Input
                      value={part.name}
                      onChange={(e) => handlePartChange(priceRule.id, idx, "name", e.target.value)}
                      placeholder="Part Name"
                      className="w-24"
                    />
                    <Input
                      type="number"
                      value={part.quantity}
                      onChange={(e) => handlePartChange(priceRule.id, idx, "quantity", Number(e.target.value))}
                      placeholder="Qty"
                      className="w-16"
                    />
                    <Input
                      type="number"
                      value={part.price}
                      onChange={(e) => handlePartChange(priceRule.id, idx, "price", Number(e.target.value))}
                      placeholder="Price"
                      className="w-20"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemovePart(priceRule.id, idx)}
                      className="text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => handleAddPart(priceRule.id)} className="mt-2">
                  Add Part
                </Button>
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={priceRule.defaultLaborCost}
                  onChange={(e) => handleFieldChange(priceRule.id, "defaultLaborCost", Number(e.target.value))}
                />
              </TableCell>
              <TableCell>
                <Input
                  value={priceRule.defaultEstimatedTime}
                  onChange={(e) => handleFieldChange(priceRule.id, "defaultEstimatedTime", e.target.value)}
                />
              </TableCell>
              <TableCell className="text-right">
                <Button variant="destructive" size="sm" onClick={() => handleRemoveRow(priceRule.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
