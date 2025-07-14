"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Minus, Plus, X } from "lucide-react"
import Image from "next/image"
import type { Product } from "@/data/mock-products" // Import Product type

interface CartItemProps {
  item: Product & { quantity: number; selectedImei?: string }
  onUpdateQuantity: (productId: string, newQuantity: number, selectedImei?: string) => void
  onRemove: (productId: string, selectedImei?: string) => void
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const handleQuantityChange = (delta: number) => {
    onUpdateQuantity(item.id, item.quantity + delta, item.selectedImei)
  }

  return (
    <div className="flex items-center gap-4 p-3 border rounded-md">
      <Image
        src={item.image || "/placeholder.svg?height=50&width=50"}
        alt={item.name}
        width={50}
        height={50}
        className="rounded-md object-cover"
      />
      <div className="flex-1">
        <h3 className="font-medium">{item.name}</h3>
        <p className="text-sm text-gray-500">
          {item.sku} • ${item.price.toFixed(2)}
          {item.type === "serialized" && item.selectedImei && (
            <span className="ml-2 text-xs text-blue-600">(IMEI: {item.selectedImei})</span>
          )}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {item.type === "regular" && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 bg-transparent"
              onClick={() => handleQuantityChange(-1)}
              disabled={item.quantity <= 1} // Disable minus button if quantity is 1
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              value={item.quantity}
              onChange={(e) => {
                const newQuantity = Number.parseInt(e.target.value)
                if (!Number.isNaN(newQuantity) && newQuantity >= 1) {
                  onUpdateQuantity(item.id, newQuantity, item.selectedImei)
                }
              }}
              className="w-16 text-center h-7"
              min="1"
            />
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 bg-transparent"
              onClick={() => handleQuantityChange(1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </>
        )}
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onRemove(item.id, item.selectedImei)}>
          <X className="h-4 w-4" />
          <span className="sr-only">Remove item</span>
        </Button>
      </div>
    </div>
  )
}
