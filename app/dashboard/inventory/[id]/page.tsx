"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, PlusCircle, MinusCircle } from "lucide-react"
import Link from "next/link"
import { EditProductModal } from "@/components/pos/edit-product-modal"
import { mockProducts, type Product } from "@/data/mock-products"
import { useToast } from "@/hooks/use-toast" // Correctly import useToast

export default function ProductDetailsPage({ params }: { params: { id: string } }) {
  const [productData, setProductData] = useState<Product | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const { toast } = useToast() // Initialize useToast

  useEffect(() => {
    // Ensure params.id is a string and trim any whitespace
    const productId = String(params.id).trim()
    console.log("Params ID:", productId) // Debugging: Check the ID from URL

    // Log the entire mockProducts array to verify its content
    console.log("mockProducts array:", mockProducts)

    const foundProduct = mockProducts.find((p) => p.id === productId)
    console.log("Found Product:", foundProduct) // Debugging: Check if product is found
    setProductData(foundProduct || null)
  }, [params.id]) // Depend on params.id

  if (!productData) {
    return <div className="p-6 text-center text-gray-500">Product not found.</div>
  }

  const stockCount =
    productData.type === "serialized" ? productData.availableImeis?.length || 0 : productData.stock || 0
  const stockStatus = stockCount > 10 ? "In Stock" : stockCount > 0 ? "Low Stock" : "Out of Stock"

  const handleEditClick = () => {
    setIsEditModalOpen(true)
  }

  const handleSaveProduct = (updatedProduct: Product) => {
    // In a real application, you would send this data to your backend
    console.log("Saving updated product:", updatedProduct)
    setProductData(updatedProduct) // Update local state with new data
    setIsEditModalOpen(false)
    toast({ title: "Product Saved", description: `${updatedProduct.name} details updated.` })
    // Note: For full persistence across page loads, you'd need to update the mockProducts array in data/mock-products.ts
    // or use a more robust state management solution/backend.
  }

  // Placeholder functions for stock/IMEI management
  const handleIncreaseStock = () => {
    if (productData.type === "regular" && productData.stock !== undefined) {
      setProductData((prev) => ({ ...prev!, stock: (prev!.stock || 0) + 1 }))
      toast({ title: "Stock Increased", description: `Stock for ${productData.name} increased.` })
    }
  }

  const handleDecreaseStock = () => {
    if (productData.type === "regular" && productData.stock !== undefined && productData.stock > 0) {
      setProductData((prev) => ({ ...prev!, stock: (prev!.stock || 0) - 1 }))
      toast({ title: "Stock Decreased", description: `Stock for ${productData.name} decreased.` })
    }
  }

  const handleAddImei = () => {
    // In a real app, this would open a modal to input a new IMEI
    console.log("Add IMEI button clicked for", productData.name)
    toast({ title: "Add IMEI", description: "Add IMEI functionality not yet implemented.", variant: "info" })
  }

  const handleRemoveImei = () => {
    // In a real app, this would open a modal to select and remove an IMEI
    console.log("Remove IMEI button clicked for", productData.name)
    toast({ title: "Remove IMEI", description: "Remove IMEI functionality not yet implemented.", variant: "info" })
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/inventory">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Inventory
          </Button>
        </Link>
        <Button onClick={handleEditClick}>
          <Edit className="h-4 w-4 mr-2" /> Edit Product
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {productData.name}
            <Badge
              variant={
                stockStatus === "In Stock" ? "secondary" : stockStatus === "Low Stock" ? "outline" : "destructive"
              }
            >
              {stockStatus}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex justify-center items-center">
            <img
              src={productData.image || "/placeholder.svg?height=200&width=200"}
              alt={productData.name}
              width={200}
              height={200}
              className="rounded-lg object-cover"
            />
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">SKU:</p>
              <p className="font-medium">{productData.sku}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Category:</p>
              <p className="font-medium">{productData.category}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Carrier:</p>
              <p className="font-medium">{productData.carrier}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Price:</p>
              <p className="text-xl font-bold">${productData.price.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Cost:</p>
              <p className="font-medium">${productData.cost.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Description:</p>
              <p className="text-sm text-gray-700">{productData.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {productData.type === "regular" && (
        <Card>
          <CardHeader>
            <CardTitle>Stock Management</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <p className="text-2xl font-bold">Current Stock: {productData.stock}</p>
            <Button variant="outline" size="icon" onClick={handleIncreaseStock}>
              <PlusCircle className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleDecreaseStock}>
              <MinusCircle className="h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      )}

      {productData.type === "serialized" && (
        <Card>
          <CardHeader>
            <CardTitle>IMEI/Serial Numbers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="font-semibold">Available IMEIs ({productData.availableImeis?.length}):</p>
              <div className="flex flex-wrap gap-2">
                {productData.availableImeis?.map((imei) => (
                  <Badge key={imei} variant="secondary">
                    {imei}
                  </Badge>
                ))}
                {productData.availableImeis?.length === 0 && (
                  <p className="text-sm text-gray-500">No IMEIs currently in stock.</p>
                )}
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <p className="font-semibold">Sold IMEIs ({productData.soldImeis?.length}):</p>
              <div className="flex flex-wrap gap-2">
                {productData.soldImeis?.map((imei) => (
                  <Badge key={imei} variant="outline">
                    {imei}
                  </Badge>
                ))}
                {productData.soldImeis?.length === 0 && <p className="text-sm text-gray-500">No IMEIs sold yet.</p>}
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button onClick={handleAddImei}>Add IMEI</Button>
              <Button variant="outline" onClick={handleRemoveImei}>
                Remove IMEI
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        product={productData}
        onSave={handleSaveProduct}
      />
    </div>
  )
}
