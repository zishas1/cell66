"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { CustomerSearchSelect } from "@/components/customers/customer-search-select"
import {
  getBrands,
  getModelsByBrand,
  getIssuesWithPricingByBrandAndModel,
  getPricingForIssue,
} from "@/data/mock-default-repair-pricing"
import { mockCustomers } from "@/data/mock-customers"
import type { RepairDetails } from "@/data/mock-repairs"

interface CreateRepairModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (repair: RepairDetails) => void
  initialData?: RepairDetails
  pricingTemplates?: any[] // This prop is not used in this component, but kept for compatibility
}

export function CreateRepairModal({ isOpen, onClose, onSave, initialData }: CreateRepairModalProps) {
  const [customerId, setCustomerId] = useState(initialData?.customerId || "")
  const [customerName, setCustomerName] = useState(initialData?.customerName || "")
  const [deviceBrand, setDeviceBrand] = useState(initialData?.deviceBrand || "")
  const [deviceModel, setDeviceModel] = useState(initialData?.deviceModel || "")
  const [issue, setIssue] = useState(initialData?.issue || "")
  const [imei, setImei] = useState(initialData?.imei || "")
  const [serialNumber, setSerialNumber] = useState(initialData?.serialNumber || "")
  const [estimatedCost, setEstimatedCost] = useState(initialData?.estimatedCost || 0)
  const [laborCost, setLaborCost] = useState(initialData?.laborCost || 0)
  const [notes, setNotes] = useState(initialData?.notes || "")
  const [assignedToId, setAssignedToId] = useState(initialData?.assignedToId || "")
  const [isWarranty, setIsWarranty] = useState(initialData?.isWarranty || false)
  const [isWalkIn, setIsWalkIn] = useState(false) // New state for walk-in customer

  const brands = getBrands()
  const models = deviceBrand ? getModelsByBrand(deviceBrand) : []
  const issuesWithPricing =
    deviceBrand && deviceModel ? getIssuesWithPricingByBrandAndModel(deviceBrand, deviceModel) : []

  useEffect(() => {
    if (initialData) {
      setCustomerId(initialData.customerId)
      setCustomerName(initialData.customerName)
      setDeviceBrand(initialData.deviceBrand)
      setDeviceModel(initialData.deviceModel)
      setIssue(initialData.issue)
      setImei(initialData.imei || "")
      setSerialNumber(initialData.serialNumber || "")
      setEstimatedCost(initialData.estimatedCost)
      setLaborCost(initialData.laborCost)
      setNotes(initialData.notes || "")
      setAssignedToId(initialData.assignedToId || "")
      setIsWarranty(initialData.isWarranty || false)
    } else {
      // Reset form for new creation
      setCustomerId("")
      setCustomerName("")
      setDeviceBrand("")
      setDeviceModel("")
      setIssue("")
      setImei("")
      setSerialNumber("")
      setEstimatedCost(0)
      setLaborCost(0)
      setNotes("")
      setAssignedToId("")
      setIsWarranty(false)
      setIsWalkIn(false)
    }
  }, [isOpen, initialData])

  useEffect(() => {
    if (deviceBrand && deviceModel && issue) {
      const pricing = getPricingForIssue(deviceBrand, deviceModel, issue)
      if (pricing) {
        setEstimatedCost(pricing.estimatedCost)
        setLaborCost(pricing.laborCost)
      } else {
        setEstimatedCost(0)
        setLaborCost(0)
      }
    } else {
      setEstimatedCost(0)
      setLaborCost(0)
    }
  }, [deviceBrand, deviceModel, issue])

  const handleSubmit = () => {
    if (!customerName || !deviceBrand || !deviceModel || !issue || estimatedCost <= 0) {
      alert(
        "Please fill in all required fields: Customer, Device Brand, Model, Issue, and ensure Estimated Cost is greater than 0.",
      )
      return
    }

    const customer = mockCustomers.find((c) => c.id === customerId)
    const assignedTo = mockCustomers.find((c) => c.id === assignedToId)

    const newRepair: RepairDetails = {
      id: initialData?.id || `REP${Date.now()}`,
      customerId: customerId,
      customerName: customer?.name || customerName,
      customerPhone: customer?.phone || "", // Assuming phone is available on customer object
      deviceBrand,
      deviceModel,
      issue,
      imei: imei || undefined,
      serialNumber: serialNumber || undefined,
      estimatedCost,
      laborCost,
      status: initialData?.status || "Pending",
      priority: initialData?.priority || "Medium",
      notes,
      assignedToId: assignedToId || undefined,
      assignedToName: assignedTo?.name || undefined,
      isWarranty,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    onSave(newRepair)
    onClose()
  }

  const handleCustomerSelect = (customer: { id: string; name: string }) => {
    setCustomerId(customer.id)
    setCustomerName(customer.name)
  }

  const mockRepairTechs = mockCustomers.filter((c) => c.role === "technician" || c.role === "admin")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Repair" : "Create New Repair"}</DialogTitle>
          <DialogDescription>Fill out the details for the device repair.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="customer" className="text-right">
              Customer
            </Label>
            <div className="col-span-3">
              <CustomerSearchSelect onSelectCustomer={handleCustomerSelect} initialCustomerId={customerId} />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="deviceBrand" className="text-right">
              Device Brand
            </Label>
            <Select value={deviceBrand} onValueChange={setDeviceBrand}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select brand" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="deviceModel" className="text-right">
              Device Model
            </Label>
            <Select value={deviceModel} onValueChange={setDeviceModel} disabled={!deviceBrand}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="issue" className="text-right">
              Issue
            </Label>
            <Select value={issue} onValueChange={setIssue} disabled={!deviceModel}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select issue" />
              </SelectTrigger>
              <SelectContent>
                {issuesWithPricing.map((issueOption) => (
                  <SelectItem key={issueOption.issue} value={issueOption.issue}>
                    {issueOption.issue} (Est: ${issueOption.estimatedCost?.toFixed(2)} / Labor: $
                    {issueOption.laborCost?.toFixed(2)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="estimatedCost" className="text-right">
              Estimated Cost
            </Label>
            <Input
              id="estimatedCost"
              type="number"
              value={estimatedCost}
              onChange={(e) => setEstimatedCost(Number.parseFloat(e.target.value))}
              className="col-span-3"
              readOnly
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="laborCost" className="text-right">
              Labor Cost
            </Label>
            <Input
              id="laborCost"
              type="number"
              value={laborCost}
              onChange={(e) => setLaborCost(Number.parseFloat(e.target.value))}
              className="col-span-3"
              readOnly
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="imei" className="text-right">
              IMEI
            </Label>
            <Input
              id="imei"
              value={imei}
              onChange={(e) => setImei(e.target.value)}
              className="col-span-3"
              placeholder="Optional"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="serialNumber" className="text-right">
              Serial Number
            </Label>
            <Input
              id="serialNumber"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              className="col-span-3"
              placeholder="Optional"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="assignedTo" className="text-right">
              Assigned To
            </Label>
            <Select value={assignedToId || "Unassigned"} onValueChange={setAssignedToId}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select technician" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Unassigned">Unassigned</SelectItem>
                {mockRepairTechs.map((tech) => (
                  <SelectItem key={tech.id} value={tech.id}>
                    {tech.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right">
              Notes
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="col-span-3"
              placeholder="Any specific notes about the repair..."
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="col-start-2 col-span-3 flex items-center space-x-2">
              <Checkbox id="isWarranty" checked={isWarranty} onCheckedChange={(checked) => setIsWarranty(!!checked)} />
              <Label htmlFor="isWarranty">Warranty Repair</Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>{initialData ? "Save Changes" : "Create Repair"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
