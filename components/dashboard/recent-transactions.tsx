"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const recentTransactions = [
  {
    id: "TRX001",
    type: "Sale",
    description: "iPhone 15 Pro Max, AirPods Pro",
    amount: 1449.98,
    date: "2023-10-26",
    status: "Completed",
  },
  {
    id: "TRX002",
    type: "Repair",
    description: "iPhone 12 Screen Replacement",
    amount: 120.0,
    date: "2023-10-25",
    status: "Completed",
  },
  {
    id: "TRX003",
    type: "Rental",
    description: "iPad Pro Rental (3 days)",
    amount: 150.0,
    date: "2023-10-24",
    status: "Pending",
  },
  {
    id: "TRX004",
    type: "Activation",
    description: "New AT&T Line Activation",
    amount: 30.0,
    date: "2023-10-23",
    status: "Completed",
  },
  {
    id: "TRX005",
    type: "Sale",
    description: "Samsung Galaxy S24, Case",
    amount: 1329.98,
    date: "2023-10-22",
    status: "Completed",
  },
]

export function RecentTransactions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">{transaction.type}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{transaction.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
