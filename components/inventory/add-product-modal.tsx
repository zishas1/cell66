"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
  onAddProduct: (productData: {
    name: string
    sku: string
    price: number
    cost: number
    category: string
    carrier: string
    description: string
    stock: number
    type: "regular" | "serialized"
    serialNumbers?: string[] // Added for serialized products
  }) => void
}

export function AddProductModal({ isOpen, onClose, onAddProduct }: AddProductModalProps) {
  const [name, setName] = useState("")
  const [sku, setSku] = useState("")
  const [price, setPrice] = useState<number | string>("")
  const [cost, setCost] = useState<number | string>("")
  const [category, setCategory] = useState("")
  const [carrier, setCarrier] = useState("")
  const [description, setDescription] = useState("")
  const [stock, setStock] = useState<number | string>("")
  const [type, setType] = useState<"regular" | "serialized">("regular")
  const [serialNumbersInput, setSerialNumbersInput] = useState("") // New state for serial numbers textarea

  // Reset form fields when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setName("")
      setSku("")
      setPrice("")
      setCost("")
      setCategory("")
      setCarrier("")
      setDescription("")
      setStock("")
      setType("regular")
      setSerialNumbersInput("")
    }
  }, [isOpen])

  const handleSubmit = () => {
    let finalStock: number
    let productSerialNumbers: string[] | undefined

    if (type === "serialized") {
      productSerialNumbers = serialNumbersInput
        .split("\n")
        .map((s) => s.trim())
        .filter((s) => s !== "")
      finalStock = productSerialNumbers.length
    } else {
      finalStock = typeof stock === "number" ? stock : 0
    }

    if (
      name &&
      sku &&
      typeof price === "number" &&
      typeof cost === "number" &&
      category &&
      carrier &&
      finalStock >= 0 // Stock can be 0
    ) {
      onAddProduct({
        name,
        sku,
        price,
        cost,
        category,
        carrier,
        description,
        stock: finalStock,
        type,
        serialNumbers: productSerialNumbers,
      })
      onClose() // Close modal after successful submission
    } else {
      alert("Please fill in all required fields and ensure valid numbers for Price, Cost, and Stock.")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sku" className="text-right">
              SKU
            </Label>
            <Input id="sku" value={sku} onChange={(e) => setSku(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Price
            </Label>
            <Input
              id="price"
              type="number"
              value={price === 0 ? "" : price} // Ensure 0 doesn't show as empty string initially
              onChange={(e) => setPrice(Number.parseFloat(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cost" className="text-right">
              Cost
            </Label>
            <Input
              id="cost"
              type="number"
              value={cost === 0 ? "" : cost} // Ensure 0 doesn't show as empty string initially
              onChange={(e) => setCost(Number.parseFloat(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="smartphones">Smartphones</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
                <SelectItem value="activations">Activations</SelectItem>
                <SelectItem value="repairs">Repairs</SelectItem>
                <SelectItem value="rentals">Rentals</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="carrier" className="text-right">
              Carrier
            </Label>
            <Select value={carrier} onValueChange={setCarrier}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select carrier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unlocked">Unlocked</SelectItem>
                <SelectItem value="verizon">Verizon</SelectItem>
                <SelectItem value="att">AT&T</SelectItem>
                <SelectItem value="tmobile">T-Mobile</SelectItem>
                <SelectItem value="n/a">N/A</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <Select value={type} onValueChange={(value) => setType(value as "regular" | "serialized")}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="regular">Regular</SelectItem>
                <SelectItem value="serialized">Serialized</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {type === "serialized" ? (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="serialNumbers" className="text-right">
                Serial Numbers (one per line)
              </Label>
              <Textarea
                id="serialNumbers"
                value={serialNumbersInput}
                onChange={(e) => setSerialNumbersInput(e.target.value)}
                className="col-span-3"
                placeholder="Enter serial numbers, one per line"
              />
            </div>
          ) : (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stock" className="text-right">
                Stock
              </Label>
              <Input
                id="stock"
                type="number"
                value={stock === 0 ? "" : stock} // Ensure 0 doesn't show as empty string initially
                onChange={(e) => setStock(Number.parseInt(e.target.value))}
                className="col-span-3"
              />
            </div>
          )}

          {type === "serialized" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="calculatedStock" className="text-right">
                Calculated Stock
              </Label>
              <Input
                id="calculatedStock"
                type="number"
                value={serialNumbersInput.split("\n").filter((s) => s.trim() !== "").length}
                className="col-span-3"
                readOnly
              />
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Add Product
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
