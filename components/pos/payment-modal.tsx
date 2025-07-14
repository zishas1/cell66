"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle } from "lucide-react"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  totalAmount: number
  onPayment: (paymentData: { method: string; amountPaid: number; change: number }) => void
}

export function PaymentModal({ isOpen, onClose, totalAmount, onPayment }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [amountPaid, setAmountPaid] = useState(totalAmount)
  const [change, setChange] = useState(0)

  const handleAmountPaidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const paid = Number.parseFloat(e.target.value) || 0
    setAmountPaid(paid)
    setChange(paid - totalAmount)
  }

  const handleConfirmPayment = () => {
    onPayment({ method: paymentMethod, amountPaid, change })
    // Reset state for next use
    setPaymentMethod("cash")
    setAmountPaid(totalAmount)
    setChange(0)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Process Payment</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <Label className="text-lg font-semibold">Total Due:</Label>
            <span className="text-2xl font-bold">${totalAmount.toFixed(2)}</span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger id="paymentMethod">
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="credit_card">Credit Card</SelectItem>
                <SelectItem value="debit_card">Debit Card</SelectItem>
                <SelectItem value="mobile_pay">Mobile Pay</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {paymentMethod === "cash" && (
            <div className="space-y-2">
              <Label htmlFor="amountPaid">Amount Paid</Label>
              <Input
                id="amountPaid"
                type="number"
                value={amountPaid.toFixed(2)}
                onChange={handleAmountPaidChange}
                step="0.01"
              />
            </div>
          )}

          {paymentMethod === "cash" && (
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Change Due:</Label>
              <span className={`text-2xl font-bold ${change < 0 ? "text-red-500" : "text-green-500"}`}>
                ${change.toFixed(2)}
              </span>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleConfirmPayment} disabled={amountPaid < totalAmount}>
            <CheckCircle className="h-4 w-4 mr-2" /> Complete Sale
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
