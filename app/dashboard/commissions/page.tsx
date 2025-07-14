"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CommissionEntry {
  id: string
  type: "Sale" | "Activation" | "Rental" | "Reseller Line"
  sourceId: string // e.g., transaction ID, rental ID, line ID
  date: string
  amount: number
  repName: string
  repId: string
  resellerName?: string
  resellerId?: string
  customerName: string
}

const mockCommissions: CommissionEntry[] = [
  {
    id: "C001",
    type: "Sale",
    sourceId: "TRX001",
    date: "2023-10-20",
    amount: 15.0,
    repName: "Sales Rep A",
    repId: "SALES001",
    customerName: "John Doe",
  },
  {
    id: "C002",
    type: "Activation",
    sourceId: "ACT001",
    date: "2023-10-21",
    amount: 20.0,
    repName: "Sales Rep B",
    repId: "SALES002",
    customerName: "Jane Smith",
  },
  {
    id: "C003",
    type: "Rental",
    sourceId: "RENT001",
    date: "2023-10-22",
    amount: 5.0,
    repName: "Rental Staff A",
    repId: "RENTAL001",
    customerName: "Bob Johnson",
  },
  {
    id: "C004",
    type: "Reseller Line",
    sourceId: "LINE001",
    date: "2023-10-23",
    amount: 15.0,
    repName: "Mobile Connect",
    repId: "RES001",
    resellerName: "Mobile Connect",
    resellerId: "RES001",
    customerName: "Alice Wonderland",
  },
  {
    id: "C005",
    type: "Sale",
    sourceId: "TRX002",
    date: "2023-10-24",
    amount: 12.5,
    repName: "Sales Rep A",
    repId: "SALES001",
    customerName: "Charlie Brown",
  },
  {
    id: "C006",
    type: "Reseller Line",
    sourceId: "LINE002",
    date: "2023-10-25",
    amount: 25.0,
    repName: "Mobile Connect",
    repId: "RES001",
    resellerName: "Mobile Connect",
    resellerId: "RES001",
    customerName: "Bob The Builder",
  },
]

export default function CommissionsPage() {
  const [repFilter, setRepFilter] = useState("All")
  const [resellerFilter, setResellerFilter] = useState("All")
  const [typeFilter, setTypeFilter] = useState("All")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const allReps = useMemo(() => {
    const reps = new Set(mockCommissions.map((c) => c.repName))
    return ["All", ...Array.from(reps)].sort()
  }, [])

  const allResellers = useMemo(() => {
    const resellers = new Set(mockCommissions.filter((c) => c.resellerName).map((c) => c.resellerName!))
    return ["All", ...Array.from(resellers)].sort()
  }, [])

  const allTypes = useMemo(() => {
    const types = new Set(mockCommissions.map((c) => c.type))
    return ["All", ...Array.from(types)].sort()
  }, [])

  const filteredCommissions = useMemo(() => {
    return mockCommissions.filter((commission) => {
      const matchesRep = repFilter === "All" || commission.repName === repFilter
      const matchesReseller = resellerFilter === "All" || commission.resellerName === resellerFilter
      const matchesType = typeFilter === "All" || commission.type === typeFilter

      const commissionDate = new Date(commission.date)
      const start = startDate ? new Date(startDate) : null
      const end = endDate ? new Date(endDate) : null

      const matchesDateRange = (!start || commissionDate >= start) && (!end || commissionDate <= end) // Fixed: should be <= end

      return matchesRep && matchesReseller && matchesType && matchesDateRange
    })
  }, [repFilter, resellerFilter, typeFilter, startDate, endDate])

  const totalCommissions = useMemo(() => {
    return filteredCommissions.reduce((sum, c) => sum + c.amount, 0)
  }, [filteredCommissions])

  const commissionBreakdownByRep = useMemo(() => {
    return filteredCommissions.reduce(
      (acc, commission) => {
        acc[commission.repName] = (acc[commission.repName] || 0) + commission.amount
        return acc
      },
      {} as Record<string, number>,
    )
  }, [filteredCommissions])

  const commissionBreakdownByReseller = useMemo(() => {
    return filteredCommissions.reduce(
      (acc, commission) => {
        if (commission.resellerName) {
          acc[commission.resellerName] = (acc[commission.resellerName] || 0) + commission.amount
        }
        return acc
      },
      {} as Record<string, number>,
    )
  }, [filteredCommissions])

  const commissionBreakdownByType = useMemo(() => {
    return filteredCommissions.reduce(
      (acc, commission) => {
        acc[commission.type] = (acc[commission.type] || 0) + commission.amount
        return acc
      },
      {} as Record<string, number>,
    )
  }, [filteredCommissions])

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-3xl font-bold">Commissions</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Commissions Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCommissions.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Based on current filters</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sales Rep Commissions</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.entries(commissionBreakdownByRep).map(([rep, amount]) => (
              <div key={rep} className="flex justify-between text-sm">
                <span>{rep}:</span>
                <span>${amount.toFixed(2)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Reseller Commissions</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.entries(commissionBreakdownByReseller).length === 0 ? (
              <p className="text-sm text-muted-foreground">No reseller commissions in this view.</p>
            ) : (
              Object.entries(commissionBreakdownByReseller).map(([reseller, amount]) => (
                <div key={reseller} className="flex justify-between text-sm">
                  <span>{reseller}:</span>
                  <span>${amount.toFixed(2)}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Commission Filters</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="repFilter">Sales Rep / Staff</Label>
            <Select value={repFilter} onValueChange={setRepFilter}>
              <SelectTrigger id="repFilter">
                <SelectValue placeholder="All Reps" />
              </SelectTrigger>
              <SelectContent>
                {allReps.map((rep) => (
                  <SelectItem key={rep} value={rep}>
                    {rep}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="resellerFilter">Reseller</Label>
            <Select value={resellerFilter} onValueChange={setResellerFilter}>
              <SelectTrigger id="resellerFilter">
                <SelectValue placeholder="All Resellers" />
              </SelectTrigger>
              <SelectContent>
                {allResellers.map((reseller) => (
                  <SelectItem key={reseller} value={reseller}>
                    {reseller}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="typeFilter">Commission Type</Label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger id="typeFilter">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                {allTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="startDate">Date Range</Label>
            <div className="flex gap-2">
              <Input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              <Input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Commission Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Source ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Rep / Reseller</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCommissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500">
                    No commissions found matching your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCommissions.map((commission) => (
                  <TableRow key={commission.id}>
                    <TableCell>{commission.date}</TableCell>
                    <TableCell>{commission.type}</TableCell>
                    <TableCell>{commission.sourceId}</TableCell>
                    <TableCell>{commission.customerName}</TableCell>
                    <TableCell>{commission.resellerName || commission.repName}</TableCell>
                    <TableCell className="text-right font-medium">${commission.amount.toFixed(2)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
