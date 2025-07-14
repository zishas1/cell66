"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { UploadCloud } from "lucide-react"

interface BulkUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onBulkUpload: (file: File) => void
}

export function BulkUploadModal({ isOpen, onClose, onBulkUpload }: BulkUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    } else {
      setSelectedFile(null)
    }
  }

  const handleSubmit = () => {
    if (selectedFile) {
      onBulkUpload(selectedFile)
      setSelectedFile(null) // Clear file input after submission
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Bulk Upload Products</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p className="text-sm text-gray-500">Upload a CSV file containing your product data.</p>
          <div className="space-y-2">
            <Label htmlFor="csvFile">CSV File</Label>
            <Input id="csvFile" type="file" accept=".csv" onChange={handleFileChange} />
          </div>
          {selectedFile && <p className="text-sm text-gray-600">Selected file: {selectedFile.name}</p>}
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={!selectedFile}>
            <UploadCloud className="h-4 w-4 mr-2" /> Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
