"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Upload } from "lucide-react"
import { InventoryFilters } from "@/components/inventory/inventory-filters"
import { AddProductModal } from "@/components/inventory/add-product-modal"
import { BulkUploadModal } from "@/components/inventory/bulk-upload-modal"
import Link from "next/link"

interface Product {
  id: string
  name: string
  sku: string
  price: number
  cost: number
  category: string
  carrier: string
  stock: number // Simplified to single stock for all products
  type: "regular" | "serialized"
}

const mockProducts: Product[] = [
  {
    id: "IPH15PM-256-BLU",
    name: "iPhone 15 Pro Max",
    sku: "IPH15PM-256-BLU",
    price: 1199.99,
    cost: 800.0,
    category: "Smartphones",
    carrier: "Unlocked",
    stock: 5,
    type: "serialized",
  },
  {
    id: "SGS24U-512-BLK",
    name: "Samsung Galaxy S24 Ultra",
    sku: "SGS24U-512-BLK",
    price: 1299.99,
    cost: 850.0,
    category: "Smartphones",
    carrier: "Unlocked",
    stock: 3,
    type: "serialized",
  },
  {
    id: "APP2-WHT",
    name: "AirPods Pro 2nd Gen",
    sku: "APP2-WHT",
    price: 249.99,
    cost: 150.0,
    category: "Accessories",
    carrier: "N/A",
    stock: 30,
    type: "regular",
  },
  {
    id: "GOOPIX8-128-OBS",
    name: "Google Pixel 8",
    sku: "GOOPIX8-128-OBS",
    price: 699.99,
    cost: 450.0,
    category: "Smartphones",
    carrier: "Unlocked",
    stock: 8,
    type: "serialized",
  },
  {
    id: "CASE-IP15PRO",
    name: "Clear Case for iPhone 15 Pro",
    sku: "CASE-IP15PRO",
    price: 19.99,
    cost: 8.0,
    category: "Accessories",
    carrier: "N/A",
    stock: 50,
    type: "regular",
  },
  {
    id: "CHRG-USB-C",
    name: "USB-C Fast Charger",
    sku: "CHRG-USB-C",
    price: 29.99,
    cost: 12.0,
    category: "Accessories",
    carrier: "N/A",
    stock: 40,
    type: "regular",
  },
]

export default function InventoryPage() {
  const [filters, setFilters] = useState({ searchTerm: "", category: "all", carrier: "all", stockStatus: "all" })
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false)

  const filteredProducts = useMemo(() => {
    return mockProducts.filter((product) => {
      const matchesSearch =
        filters.searchTerm === "" ||
        product.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(filters.searchTerm.toLowerCase())

      const matchesCategory =
        filters.category === "all" || product.category.toLowerCase() === filters.category.toLowerCase()

      const matchesCarrier =
        filters.carrier === "all" || product.carrier.toLowerCase() === filters.carrier.toLowerCase()

      const matchesStockStatus =
        filters.stockStatus === "all" ||
        (filters.stockStatus === "in-stock" && product.stock > 10) ||
        (filters.stockStatus === "low-stock" && product.stock <= 10 && product.stock > 0) ||
        (filters.stockStatus === "out-of-stock" && product.stock === 0)

      return matchesSearch && matchesCategory && matchesCarrier && matchesStockStatus
    })
  }, [filters])

  const handleAddProduct = (productData: any) => {
    console.log("Adding product:", productData)
    // In a real app, you'd send this to a backend
    setIsAddModalOpen(false)
  }

  const handleBulkUpload = (file: File) => {
    console.log("Uploading file:", file.name)
    // In a real app, you'd send this to a backend
    setIsBulkUploadModalOpen(false)
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Inventory</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsBulkUploadModalOpen(true)}>
            <Upload className="h-4 w-4 mr-2" /> Bulk Upload
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" /> Add New Product
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <InventoryFilters onFiltersChange={setFilters} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Carrier</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500">
                    No products found matching your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.carrier}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={product.stock > 10 ? "secondary" : product.stock > 0 ? "outline" : "destructive"}>
                        {product.stock}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/dashboard/inventory/${product.id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddProduct={handleAddProduct}
      />
      <BulkUploadModal
        isOpen={isBulkUploadModalOpen}
        onClose={() => setIsBulkUploadModalOpen(false)}
        onBulkUpload={handleBulkUpload}
      />
    </div>
  )
}
