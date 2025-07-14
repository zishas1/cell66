"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"

interface User {
  id: string
  name: string
  email: string
  role: string
  phone?: string
  address?: string
}

interface AccountSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
}

export function AccountSettingsModal({ isOpen, onClose, user }: AccountSettingsModalProps) {
  const { toast } = useToast()
  const [profileName, setProfileName] = React.useState(user?.name || "")
  const [profileEmail, setProfileEmail] = React.useState(user?.email || "")
  const [profilePhone, setProfilePhone] = React.useState(user?.phone || "")
  const [profileAddress, setProfileAddress] = React.useState(user?.address || "")
  const [currentPassword, setCurrentPassword] = React.useState("")
  const [newPassword, setNewPassword] = React.useState("")
  const [confirmNewPassword, setConfirmNewPassword] = React.useState("")
  const [emailNotifications, setEmailNotifications] = React.useState(true)
  const [smsNotifications, setSmsNotifications] = React.useState(false)

  React.useEffect(() => {
    if (user) {
      setProfileName(user.name)
      setProfileEmail(user.email)
      setProfilePhone(user.phone || "")
      setProfileAddress(user.address || "")
    }
  }, [user])

  const handleProfileSave = () => {
    // In a real application, you would send this data to your backend
    console.log("Saving profile:", { profileName, profileEmail, profilePhone, profileAddress })
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved.",
    })
    onClose()
  }

  const handleChangePassword = () => {
    if (newPassword !== confirmNewPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirmation do not match.",
        variant: "destructive",
      })
      return
    }
    if (newPassword.length < 6) {
      toast({
        title: "Password Too Short",
        description: "New password must be at least 6 characters long.",
        variant: "destructive",
      })
      return
    }
    // In a real application, you would send this to your backend for password change
    console.log("Changing password:", { currentPassword, newPassword })
    toast({
      title: "Password Changed",
      description: "Your password has been updated successfully.",
    })
    setCurrentPassword("")
    setNewPassword("")
    setConfirmNewPassword("")
    onClose()
  }

  const handleNotificationSave = () => {
    // In a real application, you would send this data to your backend
    console.log("Saving notifications:", { emailNotifications, smsNotifications })
    toast({
      title: "Notification Settings Updated",
      description: "Your notification preferences have been saved.",
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Account Settings</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          <TabsContent value="profile" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={profileName} onChange={(e) => setProfileName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" value={profileAddress} onChange={(e) => setProfileAddress(e.target.value)} />
            </div>
            <Button onClick={handleProfileSave} className="w-full">
              Save Profile
            </Button>
          </TabsContent>
          <TabsContent value="password" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-new-password">Confirm New Password</Label>
              <Input
                id="confirm-new-password"
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </div>
            <Button onClick={handleChangePassword} className="w-full">
              Change Password
            </Button>
          </TabsContent>
          <TabsContent value="notifications" className="space-y-4 py-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <Switch id="email-notifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="sms-notifications">SMS Notifications</Label>
              <Switch id="sms-notifications" checked={smsNotifications} onCheckedChange={setSmsNotifications} />
            </div>
            <Button onClick={handleNotificationSave} className="w-full">
              Save Notifications
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
