"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlusCircle } from "lucide-react"
import { NewConversationModal } from "@/components/messages/new-conversation-modal"
import { useState } from "react"

const mockConversations = [
  {
    id: "MSG001",
    customer: "John Doe",
    subject: "iPhone 15 Stock Inquiry",
    lastMessage: "We have one in stock!",
    date: "2023-10-26",
    status: "Open",
  },
  {
    id: "MSG002",
    customer: "Jane Smith",
    subject: "Repair Status Update",
    lastMessage: "Your repair is complete.",
    date: "2023-10-25",
    status: "Closed",
  },
  {
    id: "MSG003",
    customer: "Bob Johnson",
    subject: "New Plan Options",
    lastMessage: "I'd like to discuss new plans.",
    date: "2023-10-24",
    status: "Open",
  },
]

export default function MessagesPage() {
  const [isNewConversationModalOpen, setIsNewConversationModalOpen] = useState(false)

  const handleNewConversation = (conversationData: any) => {
    console.log("Starting new conversation:", conversationData)
    // In a real app, you'd send this to a backend
    setIsNewConversationModalOpen(false)
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Messages</h1>
        <Button onClick={() => setIsNewConversationModalOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" /> New Conversation
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Conversations</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Last Message</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockConversations.map((conversation) => (
                <TableRow key={conversation.id}>
                  <TableCell className="font-medium">{conversation.customer}</TableCell>
                  <TableCell>{conversation.subject}</TableCell>
                  <TableCell className="text-sm text-gray-500">{conversation.lastMessage}</TableCell>
                  <TableCell>{conversation.date}</TableCell>
                  <TableCell>
                    <Badge variant={conversation.status === "Open" ? "default" : "secondary"}>
                      {conversation.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <NewConversationModal
        isOpen={isNewConversationModalOpen}
        onClose={() => setIsNewConversationModalOpen(false)}
        onNewConversation={handleNewConversation}
      />
    </div>
  )
}
