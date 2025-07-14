"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, DollarSign } from "lucide-react"
import { ProductSearch } from "@/components/pos/product-search"
import { CartItem } from "@/components/pos/cart-item"
import { PaymentModal } from "@/components/pos/payment-modal"
import { PostCheckoutModal } from "@/components/pos/post-checkout-modal"
import { CustomerSearchSelect } from "@/components/customers/customer-search-select"
import { CreateRepairModal, type RepairFormData } from "@/components/repairs/create-repair-modal" // Import RepairFormData
import type { Product } from "@/data/mock-products"
import { Wrench } from "lucide-react"

interface Customer {
  id: string
  name: string
  email: string
  phone: string
}

export default function POSPage() {
  const [cart, setCart] = useState<(Product & { quantity: number })[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isPostCheckoutModalOpen, setIsPostCheckoutModalOpen] = useState(false)
  const [transactionDetails, setTransactionDetails] = useState<any>(null)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isCreateRepairModalOpen, setIsCreateRepairModalOpen] = useState(false)

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }, [cart])

  const taxRate = 0.08 // 8% tax
  const taxAmount = useMemo(() => subtotal * taxRate, [subtotal])
  const total = useMemo(() => subtotal + taxAmount, [subtotal, taxAmount])

  const handleProductSelect = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)
      if (existingItem) {
        return prevCart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      } else {
        return [...prevCart, { ...product, quantity: 1 }]
      }
    })
  }

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => (item.id === productId ? { ...item, quantity: quantity } : item))
        .filter((item) => item.quantity > 0),
    )
  }

  const handleRemoveItem = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId))
  }

  const handleProcessPayment = (paymentInfo: any) => {
    console.log("Processing payment:", paymentInfo)
    // Simulate payment processing
    const newTransaction = {
      id: `TRX-${Date.now()}`,
      date: new Date().toLocaleString(),
      customer: selectedCustomer ? selectedCustomer.name : "Walk-in Customer",
      items: cart.map((item) => ({ name: item.name, quantity: item.quantity, price: item.price })),
      subtotal: subtotal,
      tax: taxAmount,
      total: total,
      paymentMethod: paymentInfo.method,
      status: "Completed",
    }
    setTransactionDetails(newTransaction)
    setIsPaymentModalOpen(false)
    setIsPostCheckoutModalOpen(true)
    setCart([]) // Clear cart after successful transaction
    setSelectedCustomer(null) // Clear selected customer
  }

  const handleAddRepairToPOS = (repairData: RepairFormData, repairTotalCost: number) => {
    console.log("Adding repair to POS:", repairData, "Total Cost:", repairTotalCost)

    const repairProduct: Product & { quantity: number } = {
      id: `repair-${Date.now()}`, // Unique ID for this repair as a product
      name: `Repair: ${repairData.repairItems[0]?.brand || ""} ${repairData.repairItems[0]?.model || ""} ${repairData.repairItems[0]?.issueDescription || ""}`,
      description: repairData.notes || "Customer device repair service.",
      price: repairTotalCost,
      category: "Service",
      stock: 1, // Repairs are services, so stock is always 1
      imageUrl: "/placeholder.svg?height=100&width=100&text=Repair",
      quantity: 1,
    }

    setCart((prevCart) => {
      // Add the repair as a single item to the cart
      return [...prevCart, repairProduct]
    })

    // Optionally, you might want to save the repair details to a separate repairs list
    // For now, we just add it to the POS cart.
  }

  return (
    <div className="flex h-full">
      {/* Left Panel: Product Search & Cart */}
      <div className="flex flex-col w-2/3 p-6 border-r">
        <h1 className="text-3xl font-bold mb-6">Point of Sale</h1>

        {/* Customer Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Customer</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomerSearchSelect onCustomerSelect={setSelectedCustomer} selectedCustomer={selectedCustomer} />
          </CardContent>
        </Card>

        {/* Product Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add Products</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductSearch onProductSelect={handleProductSelect} />
          </CardContent>
        </Card>

        {/* Repair Integration */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Add Repair Service</CardTitle>
            <Button variant="outline" onClick={() => setIsCreateRepairModalOpen(true)}>
              <Wrench className="h-4 w-4 mr-2" /> Create Repair
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Click "Create Repair" to add a repair service directly to the current transaction.
            </p>
          </CardContent>
        </Card>

        {/* Cart */}
        <Card className="flex-1 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" /> Cart ({cart.length} items)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto">
            {cart.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Your cart is empty. Add some products or repairs!
              </p>
            ) : (
              <div className="space-y-2">
                {cart.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemoveItem={handleRemoveItem}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right Panel: Checkout Summary */}
      <div className="flex flex-col w-1/3 p-6 bg-gray-50 dark:bg-gray-900">
        <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

        <div className="flex-1 space-y-4">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax ({taxRate * 100}%):</span>
            <span className="font-medium">${taxAmount.toFixed(2)}</span>
          </div>
          <div className="border-t pt-4 flex justify-between text-xl font-bold">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <Button
          className="w-full mt-6 py-3 text-lg"
          onClick={() => setIsPaymentModalOpen(true)}
          disabled={cart.length === 0}
        >
          <DollarSign className="h-5 w-5 mr-2" /> Process Payment
        </Button>
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        totalAmount={total}
        onProcessPayment={handleProcessPayment}
      />

      <PostCheckoutModal
        isOpen={isPostCheckoutModalOpen}
        onClose={() => setIsPostCheckoutModalOpen(false)}
        transaction={transactionDetails}
      />

      <CreateRepairModal
        isOpen={isCreateRepairModalOpen}
        onClose={() => setIsCreateRepairModalOpen(false)}
        onAddRepairToPOS={handleAddRepairToPOS}
      />
    </div>
  )
}
