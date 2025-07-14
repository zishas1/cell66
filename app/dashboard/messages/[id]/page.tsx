"use client"

import { TabsContent } from "@/components/ui/tabs"

import { TabsTrigger } from "@/components/ui/tabs"

import { TabsList } from "@/components/ui/tabs"

import { Tabs } from "@/components/ui/tabs"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Send, Paperclip, Clock, User } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/hooks/use-toast"

interface Message {
  id: string
  sender: string
  senderId: string
  timestamp: string
  content: string
  attachments?: { name: string; url: string }[]
}

interface AuditLogEntry {
  id: string
  timestamp: string
  action: string
  details: string
  actor: string
}

interface TicketDetails {
  id: string
  subject: string
  customerName: string
  customerId: string
  status: "Open" | "Pending" | "Closed"
  priority: "Low" | "Medium" | "High"
  assignedTo: string
  messages: Message[]
  auditLog: AuditLogEntry[]
}

const mockTicketDetails: TicketDetails = {
  id: "TKT001",
  subject: "Internet connectivity issue",
  customerName: "John Doe",
  customerId: "CUST001",
  status: "Open",
  priority: "High",
  assignedTo: "Jane Smith",
  messages: [
    {
      id: "MSG001",
      sender: "John Doe",
      senderId: "CUST001",
      timestamp: "2023-11-01 10:00 AM",
      content: "My internet has been constantly dropping since yesterday. I can't work.",
    },
    {
      id: "MSG002",
      sender: "Jane Smith (Agent)",
      senderId: "AGENT001",
      timestamp: "2023-11-01 10:15 AM",
      content:
        "Thank you for reaching out, John. I've opened a ticket for you. Can you please try restarting your router and modem?",
    },
    {
      id: "MSG003",
      sender: "John Doe",
      senderId: "CUST001",
      timestamp: "2023-11-01 10:30 AM",
      content: "Yes, I've tried that multiple times. It works for a few minutes then drops again.",
      attachments: [{ name: "speedtest.png", url: "/placeholder.svg?height=100&width=150" }],
    },
  ],
  auditLog: [
    {
      id: "LOG001",
      timestamp: "2023-11-01 09:55 AM",
      action: "Ticket Created",
      details: "Ticket opened by system.",
      actor: "System",
    },
    {
      id: "LOG002",
      timestamp: "2023-11-01 10:15 AM",
      action: "Assigned",
      details: "Assigned to Jane Smith.",
      actor: "Admin",
    },
    {
      id: "LOG003",
      timestamp: "2023-11-01 10:35 AM",
      action: "Status Change",
      details: "Status changed from Open to In Progress.",
      actor: "Jane Smith",
    },
  ],
}

export default function MessageDetailsPage({ params }: { params: { id: string } }) {
  const [ticket, setTicket] = useState<TicketDetails | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    // In a real app, fetch ticket details based on params.id
    setTicket(mockTicketDetails) // Using mock data for now
  }, [params.id])

  if (!ticket) {
    return <div className="p-6 text-center text-gray-500">Ticket not found.</div>
  }

  const handleSendMessage = () => {
    if (newMessage.trim() === "" && !selectedFile) {
      toast({ title: "Empty Message", description: "Please type a message or attach a file.", variant: "destructive" })
      return
    }

    const newMsg: Message = {
      id: `MSG${Date.now()}`,
      sender: "Current User (Agent)", // Mock current user
      senderId: "AGENT001",
      timestamp: new Date().toLocaleString(),
      content: newMessage.trim(),
      attachments: selectedFile ? [{ name: selectedFile.name, url: URL.createObjectURL(selectedFile) }] : undefined,
    }

    setTicket((prev) => {
      if (!prev) return null
      return {
        ...prev,
        messages: [...prev.messages, newMsg],
        auditLog: [
          ...prev.auditLog,
          {
            id: `LOG${Date.now()}`,
            timestamp: new Date().toLocaleString(),
            action: "Reply Sent",
            details: `Message sent by Current User.`,
            actor: "Current User",
          },
        ],
      }
    })
    setNewMessage("")
    setSelectedFile(null)
    if (document.getElementById("file-upload-input")) {
      ;(document.getElementById("file-upload-input") as HTMLInputElement).value = ""
    }
    toast({ title: "Message Sent", description: "Your reply has been sent." })
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0])
    } else {
      setSelectedFile(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Open":
        return <Badge variant="default">Open</Badge>
      case "Pending":
        return <Badge variant="secondary">Pending</Badge>
      case "Closed":
        return <Badge variant="outline">Closed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "High":
        return <Badge variant="destructive">High</Badge>
      case "Medium":
        return <Badge variant="secondary">Medium</Badge>
      case "Low":
        return <Badge variant="outline">Low</Badge>
      default:
        return <Badge variant="secondary">{priority}</Badge>
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/support">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Tickets
          </Button>
        </Link>
        <div className="flex gap-2">
          <Button variant="outline">Resolve Ticket (Mock)</Button>
          <Button variant="destructive">Close Ticket (Mock)</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Ticket #{ticket.id}: {ticket.subject}
            <div className="flex gap-2">
              {getStatusBadge(ticket.status)}
              {getPriorityBadge(ticket.priority)}
            </div>
          </CardTitle>
          <CardDescription>
            Customer:{" "}
            <Link href={`/dashboard/customers/${ticket.customerId}`} className="text-blue-600 hover:underline">
              {ticket.customerName}
            </Link>{" "}
            | Assigned To: {ticket.assignedTo}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="messages">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="audit-log">Audit Log</TabsTrigger>
            </TabsList>

            <TabsContent value="messages" className="mt-4">
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {ticket.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender.includes("Agent") ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          msg.sender.includes("Agent") ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <p className="text-xs font-semibold">
                          {msg.sender} <span className="text-gray-500 text-[10px] ml-2">{msg.timestamp}</span>
                        </p>
                        <p className="mt-1 text-sm">{msg.content}</p>
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="mt-2 text-xs text-blue-600">
                            {msg.attachments.map((att, idx) => (
                              <a
                                key={idx}
                                href={att.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 hover:underline"
                              >
                                <Paperclip className="h-3 w-3" /> {att.name}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="mt-4 flex items-center gap-2">
                <Textarea
                  placeholder="Type your reply..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 resize-none"
                  rows={2}
                />
                <label htmlFor="file-upload-input" className="cursor-pointer">
                  <Button variant="outline" size="icon" asChild>
                    <Paperclip className="h-5 w-5" />
                  </Button>
                </label>
                <Input id="file-upload-input" type="file" className="hidden" onChange={handleFileChange} />
                <Button onClick={handleSendMessage}>
                  <Send className="h-4 w-4 mr-2" /> Send
                </Button>
              </div>
              {selectedFile && <p className="text-sm text-muted-foreground mt-2">Attached: {selectedFile.name}</p>}
            </TabsContent>

            <TabsContent value="audit-log" className="mt-4">
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {ticket.auditLog.map((log) => (
                    <div key={log.id} className="flex items-start gap-3 text-sm">
                      <div className="flex-shrink-0 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">{log.action}</p>
                        <p className="text-muted-foreground">{log.details}</p>
                        <p className="text-xs text-gray-500">
                          <User className="inline-block h-3 w-3 mr-1" /> {log.actor} at {log.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
