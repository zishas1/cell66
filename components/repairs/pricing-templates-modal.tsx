"use client"

import { useState, useEffect, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2 } from "lucide-react"
import {
  mockBrands,
  getModelsByBrand,
  getIssuesWithPricingByBrandAndModel,
  getPriceByDetails,
} from "@/data/mock-default-repair-pricing"
import type { RepairPricingTemplate } from "@/data/mock-pricing-templates"

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */

export interface PricingTemplateFormData {
  id?: string // Only present for existing templates
  name: string
  brand: string
  customBrand?: string
  model: string
  customModel?: string
  issue: string
  customIssue?: string
  price: number | string
  partsCost: number | string
  laborCost: number | string
  estimatedTime: string
  notes?: string
}

interface PricingTemplatesModalProps {
  isOpen: boolean
  onClose: () => void
  onSaveTemplate: (template: PricingTemplateFormData) => void
  onDeleteTemplate?: (id: string) => void
  initialData?: RepairPricingTemplate | null
}

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */

export function PricingTemplatesModal({
  isOpen,
  onClose,
  onSaveTemplate,
  onDeleteTemplate,
  initialData,
}: PricingTemplatesModalProps) {
  /* ----------------------------- State ---------------------------- */
  const [formData, setFormData] = useState<PricingTemplateFormData>({
    name: "",
    brand: "",
    model: "",
    issue: "",
    price: "",
    partsCost: "",
    laborCost: "",
    estimatedTime: "",
    notes: "",
  })

  /* ------------------------- Populate Form ------------------------ */
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          id: initialData.id,
          name: initialData.name,
          brand: initialData.brand,
          customBrand: initialData.brand === "Other" ? initialData.customBrand : undefined,
          model: initialData.model,
          customModel: initialData.model === "Other" ? initialData.customModel : undefined,
          issue: initialData.issue,
          customIssue: initialData.issue === "Other" ? initialData.customIssue : undefined,
          price: initialData.price,
          partsCost: initialData.partsCost,
          laborCost: initialData.laborCost,
          estimatedTime: initialData.estimatedTime,
          notes: initialData.notes,
        })
      } else {
        // Reset form for new template
        setFormData({
          name: "",
          brand: "",
          model: "",
          issue: "",
          price: "",
          partsCost: "",
          laborCost: "",
          estimatedTime: "",
          notes: "",
        })
      }
    }
  }, [isOpen, initialData])

  /* -------------------------- Handlers ---------------------------- */

  const handleChange = (field: keyof PricingTemplateFormData, value: any) => {
    setFormData((prev) => {
      const updatedData = { ...prev, [field]: value }

      // Logic to apply default pricing based on brand, model, issue
      if (["brand", "model", "issue"].includes(field as string)) {
        const currentBrand = field === "brand" ? value : updatedData.brand
        const currentModel = field === "model" ? value : updatedData.model
        const currentIssue = field === "issue" ? value : updatedData.issue

        // Use custom values if "Other" is selected
        const effectiveBrand = currentBrand === "Other" ? updatedData.customBrand : currentBrand
        const effectiveModel = currentModel === "Other" ? updatedData.customModel : currentModel
        const effectiveIssue = currentIssue === "Other" ? updatedData.customIssue : currentIssue

        if (effectiveBrand && effectiveModel && effectiveIssue) {
          const defaultPrice = getPriceByDetails(effectiveBrand, effectiveModel, effectiveIssue)
          if (defaultPrice) {
            updatedData.partsCost = defaultPrice.defaultParts.reduce((sum, part) => sum + part.price * part.quantity, 0)
            updatedData.laborCost = defaultPrice.defaultLaborCost
            updatedData.price = (updatedData.partsCost as number) + (updatedData.laborCost as number)
            updatedData.estimatedTime = defaultPrice.defaultEstimatedTime
          } else {
            // If no default price found, clear auto-filled fields
            updatedData.partsCost = ""
            updatedData.laborCost = ""
            updatedData.price = ""
            updatedData.estimatedTime = ""
          }
        } else {
          // Clear if not all details are selected
          updatedData.partsCost = ""
          updatedData.laborCost = ""
          updatedData.price = ""
          updatedData.estimatedTime = ""
        }
      }
      return updatedData
    })
  }

  const handleSubmit = () => {
    const dataToSave: PricingTemplateFormData = {
      ...formData,
      // Replace "Other" with custom values if they exist
      brand: formData.brand === "Other" ? formData.customBrand || "" : formData.brand,
      model: formData.model === "Other" ? formData.customModel || "" : formData.model,
      issue: formData.issue === "Other" ? formData.customIssue || "" : formData.issue,
      price: typeof formData.price === "number" ? formData.price : Number.parseFloat(formData.price as string) || 0,
      partsCost:
        typeof formData.partsCost === "number"
          ? formData.partsCost
          : Number.parseFloat(formData.partsCost as string) || 0,
      laborCost:
        typeof formData.laborCost === "number"
          ? formData.laborCost
          : Number.parseFloat(formData.laborCost as string) || 0,
    }

    // Basic validation
    if (
      !dataToSave.name ||
      !dataToSave.brand ||
      !dataToSave.model ||
      !dataToSave.issue ||
      typeof dataToSave.price !== "number" ||
      dataToSave.price <= 0
    ) {
      alert("Please fill in all required fields (Name, Brand, Model, Issue, Price) and ensure Price is valid.")
      return
    }

    onSaveTemplate(dataToSave)
    onClose()
  }

  const handleDelete = () => {
    if (initialData?.id && onDeleteTemplate) {
      onDeleteTemplate(initialData.id)
      onClose()
    }
  }

  /* --------------------------- Render ----------------------------- */

  const isEditMode = Boolean(initialData)

  const availableModels = useMemo(() => {
    if (formData.brand && formData.brand !== "Other") {
      return getModelsByBrand(formData.brand)
    }
    return []
  }, [formData.brand])

  const availableIssues = useMemo(() => {
    if (formData.brand && formData.brand !== "Other" && formData.model && formData.model !== "Other") {
      return getIssuesWithPricingByBrandAndModel(formData.brand, formData.model)
    }
    return []
  }, [formData.brand, formData.model])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Pricing Template" : "Create New Pricing Template"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Template Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Template Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="e.g., iPhone 13 Pro Max Screen Repair"
            />
          </div>

          {/* Brand */}
          <div className="space-y-2">
            <Label htmlFor="brand">Brand</Label>
            <Select value={formData.brand} onValueChange={(value) => handleChange("brand", value)}>
              <SelectTrigger id="brand">
                <SelectValue placeholder="Select brand" />
              </SelectTrigger>
              <SelectContent>
                {mockBrands.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            {formData.brand === "Other" && (
              <Input
                id="customBrand"
                value={formData.customBrand || ""}
                onChange={(e) => handleChange("customBrand", e.target.value)}
                placeholder="Enter custom brand"
                className="mt-2"
              />
            )}
          </div>

          {/* Model */}
          <div className="space-y-2">
            <Label htmlFor="model">Device Model</Label>
            <Select value={formData.model} onValueChange={(value) => handleChange("model", value)}>
              <SelectTrigger id="model">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                {availableModels.length > 0 ? (
                  availableModels.map((model) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="__placeholder__" disabled>
                    Select a brand first
                  </SelectItem>
                )}
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            {formData.model === "Other" && (
              <Input
                id="customModel"
                value={formData.customModel || ""}
                onChange={(e) => handleChange("customModel", e.target.value)}
                placeholder="Enter custom model"
                className="mt-2"
              />
            )}
          </div>

          {/* Issue */}
          <div className="space-y-2">
            <Label htmlFor="issue">Issue Description</Label>
            <Select value={formData.issue} onValueChange={(value) => handleChange("issue", value)}>
              <SelectTrigger id="issue">
                <SelectValue placeholder="Select issue" />
              </SelectTrigger>
              <SelectContent>
                {availableIssues.length > 0 ? (
                  availableIssues.map((issueData) => (
                    <SelectItem key={issueData.issue} value={issueData.issue}>
                      {issueData.issue} (Cost: ${issueData.estimatedCost?.toFixed(2)}, Labor: $
                      {issueData.laborCost?.toFixed(2)}, Time: {issueData.estimatedTime})
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="__placeholder_issue__" disabled>
                    Select brand and model first
                  </SelectItem>
                )}
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            {formData.issue === "Other" && (
              <Textarea
                id="customIssue"
                value={formData.customIssue || ""}
                onChange={(e) => handleChange("customIssue", e.target.value)}
                placeholder="Describe custom issue"
                className="mt-2"
              />
            )}
          </div>

          {/* Price, Parts Cost, Labor Cost, Estimated Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Total Price</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleChange("price", Number.parseFloat(e.target.value) || "")}
                placeholder="e.g., 280.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="partsCost">Parts Cost</Label>
              <Input
                id="partsCost"
                type="number"
                value={formData.partsCost}
                onChange={(e) => handleChange("partsCost", Number.parseFloat(e.target.value) || "")}
                placeholder="e.g., 200.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="laborCost">Labor Cost</Label>
              <Input
                id="laborCost"
                type="number"
                value={formData.laborCost}
                onChange={(e) => handleChange("laborCost", Number.parseFloat(e.target.value) || "")}
                placeholder="e.g., 80.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimatedTime">Estimated Time</Label>
              <Input
                id="estimatedTime"
                value={formData.estimatedTime}
                onChange={(e) => handleChange("estimatedTime", e.target.value)}
                placeholder="e.g., 1-2 hours"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes || ""}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Any specific notes for this template..."
            />
          </div>
        </div>

        <DialogFooter>
          {isEditMode && (
            <Button variant="destructive" onClick={handleDelete} className="mr-auto">
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>{isEditMode ? "Save Changes" : "Create Template"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
