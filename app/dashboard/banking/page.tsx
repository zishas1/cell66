import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const mockTransactions = [
  {
    id: "T001",
    date: "2023-10-26",
    description: "POS Sale #12345",
    type: "Deposit",
    amount: 1200.0,
    status: "Completed",
  },
  {
    id: "T002",
    date: "2023-10-25",
    description: "Supplier Payment - Phones",
    type: "Withdrawal",
    amount: -5000.0,
    status: "Completed",
  },
  {
    id: "T003",
    date: "2023-10-24",
    description: "Repair Service Fee",
    type: "Deposit",
    amount: 150.0,
    status: "Completed",
  },
  {
    id: "T004",
    date: "2023-10-23",
    description: "Rent Payment",
    type: "Withdrawal",
    amount: -2500.0,
    status: "Pending",
  },
  {
    id: "T005",
    date: "2023-10-22",
    description: "POS Sale #12346",
    type: "Deposit",
    amount: 850.0,
    status: "Completed",
  },
]

export default function BankingPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-3xl font-bold">Banking Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">$15,230.50</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Deposits (This Month)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-green-600">$8,750.25</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Withdrawals (This Month)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-red-600">-$6,120.75</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{transaction.type}</TableCell>
                  <TableCell className={transaction.amount > 0 ? "text-green-600" : "text-red-600"}>
                    ${transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={transaction.status === "Completed" ? "secondary" : "outline"}>
                      {transaction.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
