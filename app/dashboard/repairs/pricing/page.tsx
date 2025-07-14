"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Search, PlusCircle, Edit } from "lucide-react"
import { PricingTemplatesModal, type PricingTemplateFormData } from "@/components/repairs/pricing-templates-modal"
import { initialPricingTemplates, type RepairPricingTemplate } from "@/data/mock-pricing-templates"

export default function PricingPage() {
  const [pricingTemplates, setPricingTemplates] = useState<RepairPricingTemplate[]>(initialPricingTemplates)
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<RepairPricingTemplate | null>(null)

  const filteredTemplates = useMemo(() => {
    return pricingTemplates.filter(
      (template) =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.issue.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [searchTerm, pricingTemplates])

  const handleSaveTemplate = (formData: PricingTemplateFormData) => {
    if (formData.id) {
      // Edit existing template
      setPricingTemplates((prev) =>
        prev.map((tpl) =>
          tpl.id === formData.id
            ? {
                ...tpl,
                name: formData.name,
                brand: formData.brand,
                customBrand: formData.customBrand,
                model: formData.model,
                customModel: formData.customModel,
                issue: formData.issue,
                customIssue: formData.customIssue,
                price: Number(formData.price),
                partsCost: Number(formData.partsCost),
                laborCost: Number(formData.laborCost),
                estimatedTime: formData.estimatedTime,
                notes: formData.notes,
              }
            : tpl,
        ),
      )
    } else {
      // Create new template
      const newTemplate: RepairPricingTemplate = {
        id: `tpl-${Date.now()}`, // Simple ID generation
        name: formData.name,
        brand: formData.brand,
        customBrand: formData.customBrand,
        model: formData.model,
        customModel: formData.customModel,
        issue: formData.issue,
        customIssue: formData.customIssue,
        price: Number(formData.price),
        partsCost: Number(formData.partsCost),
        laborCost: Number(formData.laborCost),
        estimatedTime: formData.estimatedTime,
        notes: formData.notes,
      }
      setPricingTemplates((prev) => [...prev, newTemplate])
    }
    setIsModalOpen(false)
    setEditingTemplate(null)
  }

  const handleDeleteTemplate = (id: string) => {
    setPricingTemplates((prev) => prev.filter((tpl) => tpl.id !== id))
  }

  const openCreateModal = () => {
    setEditingTemplate(null)
    setIsModalOpen(true)
  }

  const openEditModal = (template: RepairPricingTemplate) => {
    setEditingTemplate(template)
    setIsModalOpen(true)
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Repair Pricing Templates</h1>
        <Button onClick={openCreateModal}>
          <PlusCircle className="h-4 w-4 mr-2" /> Create New Template
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search templates by name, brand, model, or issue..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Templates Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Pricing Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Template Name</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Issue</TableHead>
                <TableHead>Parts Cost</TableHead>
                <TableHead>Labor Cost</TableHead>
                <TableHead>Total Price</TableHead>
                <TableHead>Est. Time</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTemplates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell className="font-medium">{template.name}</TableCell>
                  <TableCell>{template.brand === "Other" ? template.customBrand : template.brand}</TableCell>
                  <TableCell>{template.model === "Other" ? template.customModel : template.model}</TableCell>
                  <TableCell>{template.issue === "Other" ? template.customIssue : template.issue}</TableCell>
                  <TableCell>${template.partsCost.toFixed(2)}</TableCell>
                  <TableCell>${template.laborCost.toFixed(2)}</TableCell>
                  <TableCell>${template.price.toFixed(2)}</TableCell>
                  <TableCell>{template.estimatedTime}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => openEditModal(template)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <PricingTemplatesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaveTemplate={handleSaveTemplate}
        onDeleteTemplate={handleDeleteTemplate}
        initialData={editingTemplate}
      />
    </div>
  )
}
