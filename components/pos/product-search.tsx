"use client"

import React, { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Plus, ScanLine, Eye, XCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import {
  mockProducts as initialMockProducts,
  type Product,
  type SerializedProduct,
  type RegularProduct,
} from "@/data/mock-products"

interface ProductSearchProps {
  onAddToCart: (product: Product, quantity: number, imei?: string) => void
  initialCategoryFilter?: string | null
}

const productCategories = ["Smartphones", "Accessories", "Activations", "Repairs", "Rentals", "Other"]

export const ProductSearch = React.forwardRef<HTMLInputElement, ProductSearchProps>(
  ({ onAddToCart, initialCategoryFilter }, ref) => {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState(initialCategoryFilter || "All Categories")
    const [products, setProducts] = useState<Product[]>(initialMockProducts) // State to manage product availability
    const [imeiInput, setImeiInput] = useState("")
    const [expandedProductId, setExpandedProductId] = useState<string | null>(null) // Tracks which serialized product's IMEI input is open
    const { toast } = useToast()
    const router = useRouter()

    useEffect(() => {
      setSelectedCategory(initialCategoryFilter || "All Categories")
    }, [initialCategoryFilter])

    const filteredProducts = useMemo(() => {
      const lowerCaseSearchTerm = searchTerm.toLowerCase()
      return products.filter((product) => {
        const matchesSearch =
          product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
          product.sku.toLowerCase().includes(lowerCaseSearchTerm) ||
          (product.type === "serialized" &&
            (product as SerializedProduct).imeis.some((imei) => imei.toLowerCase().includes(lowerCaseSearchTerm)))

        const matchesCategory = selectedCategory === "All Categories" || product.category === selectedCategory

        return matchesSearch && matchesCategory
      })
    }, [searchTerm, products, selectedCategory])

    const handleProductRowClick = (product: Product) => {
      if (product.type === "regular") {
        if (onAddToCart) {
          // Defensive check
          onAddToCart(product, 1) // Add regular product directly with quantity 1
          toast({
            title: "Product Added",
            description: `${product.name} added to cart.`,
          })
        } else {
          console.warn("onAddToCart function is not provided to ProductSearch component for regular product.")
          toast({
            title: "Configuration Error",
            description: "Product cannot be added to cart due to missing functionality. Please contact support.",
            variant: "destructive",
          })
        }
        setSearchTerm("") // Clear search after adding
        setExpandedProductId(null) // Close any expanded IMEI input
      } else {
        // For serialized, expand the row to show IMEI input
        setExpandedProductId(expandedProductId === product.id ? null : product.id)
        setImeiInput("") // Clear IMEI input when expanding/collapsing
      }
    }

    const handleAddSerializedToCart = (product: SerializedProduct) => {
      const trimmedImei = imeiInput.trim()

      if (!trimmedImei) {
        toast({
          title: "IMEI/Serial Number Required",
          description: `Please enter an IMEI/Serial Number for ${product.name}.`,
          variant: "destructive",
        })
        return
      }

      if (!product.availableImeis.includes(trimmedImei)) {
        toast({
          title: "IMEI Not Available",
          description: `The IMEI/Serial Number "${trimmedImei}" is not available for ${product.name}.`,
          variant: "destructive",
        })
        return
      }

      // Update product availability in local state
      setProducts((prevProducts) =>
        prevProducts.map((p) => {
          if (p.id === product.id && p.type === "serialized") {
            return {
              ...p,
              availableImeis: p.availableImeis.filter((i) => i !== trimmedImei),
              soldImeis: [...p.soldImeis, trimmedImei],
            } as SerializedProduct
          }
          return p
        }),
      )

      if (onAddToCart) {
        // Defensive check
        onAddToCart(product, 1, trimmedImei) // Serialized products are always quantity 1
        toast({
          title: "Product Added",
          description: `${product.name} (IMEI: ${trimmedImei}) added to cart.`,
        })
      } else {
        console.warn("onAddToCart function is not provided to ProductSearch component for serialized product.")
        toast({
          title: "Configuration Error",
          description: "Product cannot be added to cart due to missing functionality. Please contact support.",
          variant: "destructive",
        })
      }
      setExpandedProductId(null) // Collapse the IMEI input
      setImeiInput("") // Clear IMEI input
      setSearchTerm("") // Clear search after adding
    }

    const handleViewProductDetails = (product: Product) => {
      router.push(`/dashboard/inventory/${product.id}`)
    }

    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              ref={ref}
              placeholder="Search by product name, SKU, or scan barcode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-500"
                onClick={() => setSearchTerm("")}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Button variant="outline" size="icon">
            <ScanLine className="h-5 w-5" />
            <span className="sr-only">Scan Barcode</span>
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Categories">All Categories</SelectItem>
              {productCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value="All Carriers" onValueChange={() => {}}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Carrier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Carriers">All Carriers</SelectItem>
              <SelectItem value="Unlocked">Unlocked</SelectItem>
              <SelectItem value="Verizon">Verizon</SelectItem>
              <SelectItem value="AT&T">AT&T</SelectItem>
              <SelectItem value="T-Mobile">T-Mobile</SelectItem>
              <SelectItem value="US Mobile">US Mobile</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ScrollArea className="h-[250px] border rounded-md">
          {filteredProducts.length === 0 ? (
            <p className="p-2 text-center text-gray-500">No products found.</p>
          ) : (
            <div className="divide-y">
              {filteredProducts.map((product) => (
                <div key={product.id}>
                  <div
                    className="flex items-center justify-between p-2 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleProductRowClick(product)}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image || "/placeholder.svg?height=40&width=40"}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="rounded-md object-cover"
                      />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.sku}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">${product.price.toFixed(2)}</p>
                      {product.type === "serialized" && (
                        <span className="text-xs text-gray-400">
                          ({(product as SerializedProduct).availableImeis.length} in stock)
                        </span>
                      )}
                      {product.type === "regular" && (
                        <span className="text-xs text-gray-400">({(product as RegularProduct).stock} in stock)</span>
                      )}
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 shrink-0 bg-transparent"
                        onClick={(e) => {
                          e.stopPropagation() // Prevent row click from firing
                          handleViewProductDetails(product)
                        }}
                        title="View Product Details"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View Product Details</span>
                      </Button>
                    </div>
                  </div>
                  {/* IMEI input and Add to Cart button for serialized products */}
                  {product.type === "serialized" && expandedProductId === product.id && (
                    <div className="p-2 pt-0 space-y-2 border-t bg-gray-50">
                      <Label htmlFor={`imei-${product.id}`}>IMEI/Serial Number</Label>
                      <Input
                        id={`imei-${product.id}`}
                        placeholder="Enter IMEI or Serial Number"
                        value={imeiInput}
                        onChange={(e) => setImeiInput(e.target.value)}
                      />
                      <p className="text-xs text-gray-500">
                        Available: {(product as SerializedProduct).availableImeis.join(", ")}
                      </p>
                      <Button
                        className="w-full"
                        onClick={() => handleAddSerializedToCart(product as SerializedProduct)}
                      >
                        <Plus className="h-4 w-4 mr-2" /> Add to Cart
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    )
  },
)

ProductSearch.displayName = "ProductSearch"
