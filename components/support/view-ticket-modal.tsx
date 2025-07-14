"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Paperclip } from "lucide-react"
import { format } from "date-fns"

interface Message {
  sender: string
  content: string
  timestamp: string
}

interface Ticket {
  id: string
  subject: string
  customer: string
  status: string
  priority: string
  assignedTo: string
  description: string
  created: string
  lastUpdated: string
  messages: Message[]
}

interface ViewTicketModalProps {
  isOpen: boolean
  onClose: () => void
  ticket: Ticket
  onReply: (ticketId: string, message: string) => void
}

export function ViewTicketModal({ isOpen, onClose, ticket, onReply }: ViewTicketModalProps) {
  const [replyContent, setReplyContent] = useState("")

  const handleReply = () => {
    if (replyContent.trim()) {
      onReply(ticket.id, replyContent)
      setReplyContent("")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] flex flex-col max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Ticket: {ticket.subject}</DialogTitle>
          <DialogDescription>ID: {ticket.id}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 flex-1 overflow-hidden">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Customer</Label>
            <span className="col-span-3 font-medium">{ticket.customer}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Status</Label>
            <span className="col-span-3">{ticket.status}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Priority</Label>
            <span className="col-span-3">{ticket.priority}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Assigned To</Label>
            <span className="col-span-3">{ticket.assignedTo}</span>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">Description</Label>
            <p className="col-span-3 text-sm text-muted-foreground">{ticket.description}</p>
          </div>

          <div className="space-y-2 mt-4 flex-1 flex flex-col min-h-0">
            <Label>Conversation History</Label>
            <ScrollArea className="h-64 border rounded-md p-4 bg-muted/50 flex-1">
              {ticket.messages.length === 0 ? (
                <p className="text-center text-muted-foreground">No messages yet.</p>
              ) : (
                ticket.messages.map((message, index) => (
                  <div key={index} className="flex items-start gap-3 mb-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`/placeholder-user.jpg?name=${message.sender}`} />
                      <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1 text-sm">
                      <div className="font-bold">{message.sender}</div>
                      <div className="text-muted-foreground text-xs">
                        {format(new Date(message.timestamp), "MMM dd, yyyy HH:mm")}
                      </div>
                      <p>{message.content}</p>
                    </div>
                  </div>
                ))
              )}
            </ScrollArea>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reply">Reply</Label>
            <Textarea
              id="reply"
              placeholder="Type your reply here..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="min-h-[80px]"
            />
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <Paperclip className="h-4 w-4 mr-2" /> Attach File (Mock)
              </Button>
              <Button onClick={handleReply}>Send Reply</Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
