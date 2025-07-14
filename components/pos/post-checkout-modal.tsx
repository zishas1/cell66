"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Printer, Mail, RefreshCw, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PostCheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  onNewTransaction: () => void
  onPrintReceipt: (transactionId: string) => void
  onSendReceipt: (transactionId: string) => void
  onViewLastTransaction: (transactionId: string) => void
  transaction: {
    id: string
    date: string
    customer: string
    items: Array<{ name: string; quantity: number; price: number }>
    subtotal: number
    tax: number
    total: number
    paymentMethod: string
    status: string
  } | null // Allow transaction to be null
}

export function PostCheckoutModal({
  isOpen,
  onClose,
  onNewTransaction,
  onPrintReceipt,
  onSendReceipt,
  onViewLastTransaction,
  transaction, // Now receiving the full transaction object
}: PostCheckoutModalProps) {
  const { toast } = useToast()

  const lastTransactionId = transaction?.id || null
  const totalAmount = transaction?.total ?? 0 // Use nullish coalescing for safety

  const handlePrint = () => {
    if (lastTransactionId) {
      onPrintReceipt(lastTransactionId)
      toast({
        title: "Print Receipt",
        description: `Printing receipt for transaction ${lastTransactionId}.`,
      })
    }
    onClose()
  }

  const handleSend = () => {
    if (lastTransactionId) {
      onSendReceipt(lastTransactionId)
      toast({
        title: "Send Receipt",
        description: `Sending receipt for transaction ${lastTransactionId}.`,
      })
    }
    onClose()
  }

  const handleView = () => {
    if (lastTransactionId) {
      onViewLastTransaction(lastTransactionId)
      toast({
        title: "View Last Transaction",
        description: `Navigating to details for transaction ${lastTransactionId}.`,
      })
    }
    onClose()
  }

  const handleNew = () => {
    onNewTransaction()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sale Completed!</DialogTitle>
          <DialogDescription>Your transaction has been successfully processed.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-center">
          <p className="text-lg font-semibold">Total Paid: ${totalAmount.toFixed(2)}</p>
          {lastTransactionId && <p className="text-sm text-gray-500">Transaction ID: {lastTransactionId}</p>}
          <p className="text-md">What would you like to do next?</p>
        </div>
        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={handlePrint} disabled={!lastTransactionId}>
            <Printer className="h-4 w-4 mr-2" /> Print Receipt
          </Button>
          <Button variant="outline" onClick={handleSend} disabled={!lastTransactionId}>
            <Mail className="h-4 w-4 mr-2" /> Send Receipt
          </Button>
          <Button variant="outline" onClick={handleView} disabled={!lastTransactionId}>
            <Eye className="h-4 w-4 mr-2" /> View Last Transaction
          </Button>
          <Button onClick={handleNew}>
            <RefreshCw className="h-4 w-4 mr-2" /> New Transaction
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
