import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Printer, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

interface SaleItem {
  id: string
  name: string
  sku: string
  quantity: number
  price: number
  imei?: string
}

interface SaleDetails {
  id: string
  customerName: string
  customerPhone: string
  date: string
  items: SaleItem[]
  subtotal: number
  tax: number
  total: number
  paymentMethod: string
  status: "Completed" | "Pending" | "Cancelled"
}

const mockSaleDetails: SaleDetails = {
  id: "ORD001",
  customerName: "John Doe",
  customerPhone: "(555) 123-4567",
  date: "2023-10-26",
  items: [
    {
      id: "IPH15PM-256-BLU",
      name: "iPhone 15 Pro Max",
      sku: "IPH15PM-256-BLU",
      quantity: 1,
      price: 1199.99,
      imei: "IMEI001",
    },
    { id: "APP2-WHT", name: "AirPods Pro 2nd Gen", sku: "APP2-WHT", quantity: 1, price: 249.99 },
    { id: "CASE-IP15PRO", name: "Clear Case for iPhone 15 Pro", sku: "CASE-IP15PRO", quantity: 1, price: 19.99 },
  ],
  subtotal: 1469.97,
  tax: 117.6, // Assuming 8% tax
  total: 1587.57,
  paymentMethod: "Credit Card",
  status: "Completed",
}

export default function SaleDetailsPage({ params }: { params: { id: string } }) {
  // In a real application, you would fetch sale details based on params.id
  const sale = mockSaleDetails

  if (!sale) {
    return <div className="p-6 text-center text-gray-500">Sale not found.</div>
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/pos">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to POS
          </Button>
        </Link>
        <div className="flex gap-2">
          <Button variant="outline">
            <Printer className="h-4 w-4 mr-2" /> Print Receipt
          </Button>
          {sale.status === "Pending" && (
            <>
              <Button variant="destructive">
                <XCircle className="h-4 w-4 mr-2" /> Cancel Sale
              </Button>
              <Button>
                <CheckCircle className="h-4 w-4 mr-2" /> Mark as Completed
              </Button>
            </>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Sale #{sale.id}
            <Badge variant={sale.status === "Completed" ? "secondary" : "outline"}>{sale.status}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Customer Name:</p>
            <p className="font-medium">{sale.customerName}</p>
            <p className="text-sm text-gray-500">Customer Phone:</p>
            <p className="font-medium">{sale.customerPhone}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Date:</p>
            <p className="font-medium">{sale.date}</p>
            <p className="text-sm text-gray-500">Payment Method:</p>
            <p className="font-medium">{sale.paymentMethod}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Items Sold</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>IMEI/Serial</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sale.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.sku}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>${item.price.toFixed(2)}</TableCell>
                  <TableCell>{item.imei || "N/A"}</TableCell>
                  <TableCell className="text-right">${(item.quantity * item.price).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 flex flex-col items-end space-y-1 text-sm">
            <div className="flex justify-between w-48">
              <span>Subtotal:</span>
              <span>${sale.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between w-48">
              <span>Tax (8%):</span>
              <span>${sale.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between w-48 font-bold text-lg">
              <span>Total:</span>
              <span>${sale.total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
