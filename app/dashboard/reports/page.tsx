"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Download, CalendarDays } from "lucide-react" // Import Filter and CalendarDays
import { useState, useMemo } from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

const mockReports = [
  {
    id: "R001",
    name: "Monthly Sales Summary",
    date: "2023-10-31",
    type: "Sales",
    status: "Generated",
    department: "POS",
    user: "Admin",
  },
  {
    id: "R002",
    name: "Inventory Valuation Report",
    date: "2023-10-25",
    type: "Inventory",
    status: "Generated",
    department: "Inventory",
    user: "Admin",
  },
  {
    id: "R003",
    name: "Customer Activity Report",
    date: "2023-10-20",
    type: "Customers",
    status: "Generated",
    department: "Customers",
    user: "Sales Rep",
  },
  {
    id: "R004",
    name: "Repair Profitability",
    date: "2023-10-15",
    type: "Repairs",
    status: "Pending",
    department: "Repairs",
    user: "Technician",
  },
  {
    id: "R005",
    name: "Commission Payouts Q3",
    date: "2023-09-30",
    type: "Commissions",
    status: "Generated",
    department: "Commissions",
    user: "Bookkeeper",
  },
  {
    id: "R006",
    name: "Daily Sales Report",
    date: "2023-11-06",
    type: "Sales",
    status: "Generated",
    department: "POS",
    user: "Sales Rep",
  },
  {
    id: "R007",
    name: "Overdue Rentals",
    date: "2023-11-05",
    type: "Rentals",
    status: "Generated",
    department: "Rentals",
    user: "Rental Staff",
  },
]

export default function ReportsPage() {
  const [reportTypeFilter, setReportTypeFilter] = useState("All")
  const [departmentFilter, setDepartmentFilter] = useState("All")
  const [userFilter, setUserFilter] = useState("All")
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})

  const availableDepartments = useMemo(() => {
    const departments = new Set(mockReports.map((r) => r.department))
    return ["All", ...Array.from(departments)].sort()
  }, [])

  const availableUsers = useMemo(() => {
    const users = new Set(mockReports.map((r) => r.user))
    return ["All", ...Array.from(users)].sort()
  }, [])

  const availableReportTypes = useMemo(() => {
    const types = new Set(mockReports.map((r) => r.type))
    return ["All", ...Array.from(types)].sort()
  }, [])

  const filteredReports = useMemo(() => {
    return mockReports.filter((report) => {
      const matchesType = reportTypeFilter === "All" || report.type === reportTypeFilter
      const matchesDepartment = departmentFilter === "All" || report.department === departmentFilter
      const matchesUser = userFilter === "All" || report.user === userFilter

      const reportDate = new Date(report.date)
      const matchesDateRange =
        (!dateRange.from || reportDate >= dateRange.from) && (!dateRange.to || reportDate <= dateRange.to)

      return matchesType && matchesDepartment && matchesUser && matchesDateRange
    })
  }, [reportTypeFilter, departmentFilter, userFilter, dateRange])

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-3xl font-bold">Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Generate detailed sales summaries, product performance, and revenue breakdowns.
            </p>
            <Button className="mt-4 w-full">Generate Sales Report</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Inventory Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Track stock levels, valuation, movement, and identify low-stock items.
            </p>
            <Button className="mt-4 w-full">Generate Inventory Report</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Customer Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Analyze customer demographics, purchase history, and loyalty.</p>
            <Button className="mt-4 w-full">Generate Customer Report</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generated Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="reportTypeFilter">Report Type</Label>
              <Select value={reportTypeFilter} onValueChange={setReportTypeFilter}>
                <SelectTrigger id="reportTypeFilter">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  {availableReportTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="departmentFilter">Department</Label>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger id="departmentFilter">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  {availableDepartments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="userFilter">User</Label>
              <Select value={userFilter} onValueChange={setUserFilter}>
                <SelectTrigger id="userFilter">
                  <SelectValue placeholder="All Users" />
                </SelectTrigger>
                <SelectContent>
                  {availableUsers.map((user) => (
                    <SelectItem key={user} value={user}>
                      {user}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateRange">Date Range</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateRange.from && "text-muted-foreground",
                    )}
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={dateRange as { from: Date; to?: Date }}
                    onSelect={setDateRange as any}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Name</TableHead>
                <TableHead>Date Generated</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500">
                    No reports found matching your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.name}</TableCell>
                    <TableCell>{report.date}</TableCell>
                    <TableCell>{report.type}</TableCell>
                    <TableCell>{report.department}</TableCell>
                    <TableCell>{report.user}</TableCell>
                    <TableCell>{report.status}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" disabled={report.status === "Pending"}>
                        <Download className="h-4 w-4 mr-2" /> Download
                      </Button>
                    </TableCell>
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
