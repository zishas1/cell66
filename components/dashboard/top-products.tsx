"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const topProducts = [
  {
    name: "iPhone 15 Pro Max",
    sku: "IPH15PM-256-BLU",
    sales: 120,
    revenue: 143998.8,
    status: "High Demand",
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    sku: "SGS24U-512-BLK",
    sales: 90,
    revenue: 116999.1,
    status: "Popular",
  },
  {
    name: "AirPods Pro 2nd Gen",
    sku: "APP2-WHT",
    sales: 250,
    revenue: 62497.5,
    status: "Best Seller",
  },
  {
    name: "Google Pixel 8",
    sku: "GOOPIX8-128-OBS",
    sales: 75,
    revenue: 52499.25,
    status: "Steady",
  },
  {
    name: "iPhone 15 Pro Case",
    sku: "CASE-IP15PRO",
    sales: 500,
    revenue: 9995.0,
    status: "Accessory",
  },
]

export function TopProducts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Selling Products</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Sales</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topProducts.map((product, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell>{product.sales}</TableCell>
                <TableCell>${product.revenue.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{product.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
