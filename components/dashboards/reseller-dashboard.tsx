"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Users, Phone, TrendingUp } from "lucide-react"
import { SalesChart } from "@/components/dashboard/sales-chart"
import { ServiceStatusTracker } from "@/components/resellers/service-status-tracker"

export function ResellerDashboard() {
  return (
    <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">My Commissions</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$8,765.43</div>
          <p className="text-xs text-muted-foreground">+7.2% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Lines</CardTitle>
          <Phone className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1,200</div>
          <p className="text-xs text-muted-foreground">+50 new lines this month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">New Customers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">85</div>
          <p className="text-xs text-muted-foreground">+12% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1.5%</div>
          <p className="text-xs text-muted-foreground">-0.3% from last month</p>
        </CardContent>
      </Card>
      <Card className="col-span-full lg:col-span-2">
        <CardHeader>
          <CardTitle>Commission Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <SalesChart /> {/* Reusing for commission trends */}
        </CardContent>
      </Card>
      <Card className="col-span-full lg:col-span-2">
        <CardHeader>
          <CardTitle>Service Status</CardTitle>
        </CardHeader>
        <CardContent>
          <ServiceStatusTracker />
        </CardContent>
      </Card>
    </div>
  )
}
