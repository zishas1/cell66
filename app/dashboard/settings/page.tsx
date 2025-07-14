"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { mockMailboxes, addMailbox } from "@/data/mock-mailboxes"
import { mockCustomers, updateUserRole, updateUserPermissionOverrides, type Customer } from "@/data/mock-customers"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  ALL_PERMISSIONS,
  DEFAULT_ROLE_PERMISSIONS,
  type RolePermissions,
  type UserPermissionOverrides,
  mockUserPermissionOverrides,
  type Permission,
} from "@/data/mock-permissions"
import { UserPermissionsModal } from "@/components/settings/user-permissions-modal"

export default function SettingsPage() {
  const { toast } = useToast()

  // State for General Settings
  const [generalSettings, setGeneralSettings] = useState({
    storeName: "Cellphone Store Pro",
    storeAddress: "123 Main St, Anytown, USA",
    storePhone: "555-123-4567",
    storeEmail: "info@cellphonestore.com",
    storeDescription: "Your one-stop shop for all cell phone needs, repairs, and accessories.",
  })

  // State for POS Settings
  const [posSettings, setPosSettings] = useState({
    defaultTaxRate: 8.25,
    processingFee: 2.5,
    receiptMessage: "Thank you for your business!",
  })

  // State for User Management
  const [newUserEmail, setNewUserEmail] = useState("")
  const [newUserRole, setNewUserRole] = useState("sales_rep")
  const [usersWithRoles, setUsersWithRoles] = useState(
    mockCustomers.map((customer) => ({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      currentRole: customer.role || "customer",
      newRole: customer.role || "customer", // For pending changes
    })),
  )
  const [defaultRolePermissions, setDefaultRolePermissions] = useState<RolePermissions>(DEFAULT_ROLE_PERMISSIONS)
  const [userPermissionOverrides, setUserPermissionOverrides] =
    useState<UserPermissionOverrides>(mockUserPermissionOverrides)
  const [isUserPermissionsModalOpen, setIsUserPermissionsModalOpen] = useState(false)
  const [selectedUserForPermissions, setSelectedUserForPermissions] = useState<Customer | null>(null)

  // State for Integrations
  const [integrationSettings, setIntegrationSettings] = useState({
    smsApiKey: "sk_mock_sms_key",
    paymentGateway: "stripe",
    slackWebhookUrl: "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX",
    cardknoxApiKey: "ck_mock_api_key",
    cardknoxTerminalId: "mock_terminal_id",
    quickbooksClientId: "qb_mock_client_id",
    quickbooksClientSecret: "qb_mock_client_secret",
  })

  // State for Reporting
  const [reportingSettings, setReportingSettings] = useState({
    reportFrequency: "monthly",
    reportRecipients: "admin@example.com",
  })

  // State for Mailbox Settings
  const [newMailboxNumber, setNewMailboxNumber] = useState("")
  const [currentMailboxes, setCurrentMailboxes] = useState(mockMailboxes)

  // State for System Settings
  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    defaultCurrency: "USD",
    smsTemplate: "Your order {orderId} is ready for pickup.",
    emailTemplate: "Thank you for your purchase, {customerName}!",
    auditLogRetention: "90_days",
    storeOpenTime: "09:00",
    storeCloseTime: "18:00",
  })
  const [newApiKey, setNewApiKey] = useState("")
  const [apiKeys, setApiKeys] = useState(["api_key_123", "api_key_456"])

  // Generic handler for text/number inputs
  const handleInputChange = (
    setter: React.Dispatch<React.SetStateAction<any>>,
    key: string,
    value: string | number | boolean,
  ) => {
    setter((prev: any) => ({ ...prev, [key]: value }))
  }

  // Generic handler for select inputs
  const handleSelectChange = (setter: React.Dispatch<React.SetStateAction<any>>, key: string, value: string) => {
    setter((prev: any) => ({ ...prev, [key]: value }))
  }

  // Generic handler for switch inputs
  const handleSwitchChange = (setter: React.Dispatch<React.SetStateAction<any>>, key: string, checked: boolean) => {
    setter((prev: any) => ({ ...prev, [key]: checked }))
  }

  // Generic save handler
  const handleSave = (sectionName: string, settings: any) => {
    console.log(`Mock: Saving ${sectionName} settings`, settings)
    toast({ title: "Settings Saved", description: `${sectionName} settings updated successfully.` })
  }

  // Handlers for specific sections
  const handleSaveGeneral = () => handleSave("General", generalSettings)
  const handleSavePos = () => handleSave("POS", posSettings)
  const handleSaveIntegrations = () => handleSave("Integration", integrationSettings)
  const handleSaveReporting = () => handleSave("Reporting", reportingSettings)
  const handleSaveSystemSettings = () => handleSave("System", systemSettings)

  const handleAddUser = () => {
    console.log("Mock: Adding new user", { newUserEmail, newUserRole })
    toast({ title: "User Added", description: `User ${newUserEmail} added with role ${newUserRole}.` })
    setNewUserEmail("")
  }

  // NEW: Handlers for Mailbox Settings
  const handleAddMailbox = () => {
    if (newMailboxNumber.trim() === "") {
      toast({ title: "Error", description: "Mailbox number cannot be empty.", variant: "destructive" })
      return
    }
    if (currentMailboxes.some((mb) => mb.number === newMailboxNumber.trim())) {
      toast({ title: "Error", description: "Mailbox number already exists.", variant: "destructive" })
      return
    }
    const added = addMailbox(newMailboxNumber.trim())
    setCurrentMailboxes((prev) => [...prev, added])
    setNewMailboxNumber("")
    toast({ title: "Mailbox Added", description: `Mailbox ${added.number} added successfully.` })
  }

  // NEW: Handlers for User Roles & Permissions
  const handleRoleChange = (userId: string, newRole: string) => {
    setUsersWithRoles((prev) => prev.map((user) => (user.id === userId ? { ...user, newRole: newRole } : user)))
  }

  const handleSaveUserRoles = () => {
    usersWithRoles.forEach((user) => {
      if (user.currentRole !== user.newRole) {
        updateUserRole(user.id, user.newRole)
        console.log(`Mock: Updated role for ${user.name} to ${user.newRole}`)
      }
    })
    setUsersWithRoles((prev) => prev.map((user) => ({ ...user, currentRole: user.newRole })))
    toast({ title: "User Roles Saved", description: "User roles updated successfully." })
  }

  const handleDefaultRolePermissionChange = (role: string, permission: string, checked: boolean) => {
    setDefaultRolePermissions((prev) => ({
      ...prev,
      [role]: checked
        ? [...(prev[role] || []), permission as Permission]
        : (prev[role] || []).filter((p) => p !== permission),
    }))
  }

  const handleSaveDefaultRolePermissions = () => {
    // In a real app, this would persist to a database
    console.log("Mock: Saving default role permissions", defaultRolePermissions)
    toast({ title: "Default Role Permissions Saved", description: "Default permissions updated successfully." })
  }

  const handleOpenUserPermissionsModal = (user: Customer) => {
    setSelectedUserForPermissions(user)
    setIsUserPermissionsModalOpen(true)
  }

  const handleSaveUserOverrides = (userId: string, overrides: { [key in Permission]?: boolean }) => {
    updateUserPermissionOverrides(userId, overrides) // Update mock data
    setUserPermissionOverrides((prev) => ({
      ...prev,
      [userId]: overrides,
    }))
  }

  const handleAddApiKey = () => {
    if (newApiKey.trim() === "") {
      toast({ title: "Error", description: "API Key cannot be empty.", variant: "destructive" })
      return
    }
    setApiKeys((prev) => [...prev, newApiKey.trim()])
    setNewApiKey("")
    toast({ title: "API Key Added", description: "New API key added." })
  }

  const handleRevokeApiKey = (keyToRevoke: string) => {
    setApiKeys((prev) => prev.filter((key) => key !== keyToRevoke))
    toast({ title: "API Key Revoked", description: `API key ${keyToRevoke} revoked.` })
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="grid gap-1">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-600">Manage your store's configuration and preferences.</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-7">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="pos">POS</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="reporting">Reporting</TabsTrigger>
          <TabsTrigger value="mailboxes">Mailboxes</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>Manage your basic store details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    value={generalSettings.storeName}
                    onChange={(e) => handleInputChange(setGeneralSettings, "storeName", e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeAddress">Address</Label>
                  <Input
                    id="storeAddress"
                    value={generalSettings.storeAddress}
                    onChange={(e) => handleInputChange(setGeneralSettings, "storeAddress", e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="storePhone">Phone Number</Label>
                  <Input
                    id="storePhone"
                    value={generalSettings.storePhone}
                    onChange={(e) => handleInputChange(setGeneralSettings, "storePhone", e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeEmail">Email</Label>
                  <Input
                    id="storeEmail"
                    type="email"
                    value={generalSettings.storeEmail}
                    onChange={(e) => handleInputChange(setGeneralSettings, "storeEmail", e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeDescription">Description</Label>
                <Textarea
                  id="storeDescription"
                  value={generalSettings.storeDescription}
                  onChange={(e) => handleInputChange(setGeneralSettings, "storeDescription", e.target.value)}
                  className="col-span-3"
                />
              </div>
              <Button onClick={handleSaveGeneral}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Point of Sale Settings</CardTitle>
              <CardDescription>Configure POS specific options.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label htmlFor="defaultTaxRate" className="md:text-right">
                  Default Tax Rate (%)
                </Label>
                <Input
                  id="defaultTaxRate"
                  type="number"
                  step="0.01"
                  value={posSettings.defaultTaxRate}
                  onChange={(e) => handleInputChange(setPosSettings, "defaultTaxRate", Number(e.target.value))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label htmlFor="processingFee" className="md:text-right">
                  Processing Fee ($)
                </Label>
                <Input
                  id="processingFee"
                  type="number"
                  step="0.01"
                  value={posSettings.processingFee}
                  onChange={(e) => handleInputChange(setPosSettings, "processingFee", Number(e.target.value))}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label htmlFor="receiptMessage" className="md:text-right">
                  Receipt Message
                </Label>
                <Textarea
                  id="receiptMessage"
                  value={posSettings.receiptMessage}
                  onChange={(e) => handleInputChange(setPosSettings, "receiptMessage", e.target.value)}
                  className="col-span-3"
                />
              </div>
              <Button onClick={handleSavePos}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Tabs defaultValue="roles">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="roles">User Roles</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
            </TabsList>

            <TabsContent value="roles" className="space-y-6 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Add new users and manage roles.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-500">
                    Go to the{" "}
                    <a href="/dashboard/customers" className="text-blue-600 hover:underline">
                      Customers page
                    </a>{" "}
                    to manage individual users.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                    <Label htmlFor="newUserEmail" className="md:text-right">
                      New User Email
                    </Label>
                    <Input
                      id="newUserEmail"
                      type="email"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                    <Label htmlFor="newUserRole" className="md:text-right">
                      Role
                    </Label>
                    <Select value={newUserRole} onValueChange={setNewUserRole}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="sales_rep">Sales Representative</SelectItem>
                        <SelectItem value="reseller">Reseller</SelectItem>
                        <SelectItem value="technician">Technician</SelectItem>
                        <SelectItem value="support_agent">Support Agent</SelectItem>
                        <SelectItem value="customer">Customer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleAddUser}>Add User (Mock)</Button>
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Existing Users (Mock)</h3>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                      <li>Admin User (admin@example.com) - Admin</li>
                      <li>Sales Rep (sales@example.com) - Sales Representative</li>
                      <li>Technician (tech@example.com) - Technician</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Existing User Roles Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Adjust User Roles</CardTitle>
                  <CardDescription>Change roles for existing users.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Current Role</TableHead>
                        <TableHead>New Role</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usersWithRoles.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            {user.currentRole.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                          </TableCell>
                          <TableCell>
                            <Select value={user.newRole} onValueChange={(value) => handleRoleChange(user.id, value)}>
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="sales_rep">Sales Representative</SelectItem>
                                <SelectItem value="reseller">Reseller</SelectItem>
                                <SelectItem value="technician">Technician</SelectItem>
                                <SelectItem value="support_agent">Support Agent</SelectItem>
                                <SelectItem value="customer">Customer</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <Button onClick={handleSaveUserRoles}>Save User Roles</Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* NEW: Permissions Tab Content */}
            <TabsContent value="permissions" className="space-y-6 mt-4">
              {/* Default Role Permissions */}
              <Card>
                <CardHeader>
                  <CardTitle>Default Role Permissions</CardTitle>
                  <CardDescription>Define default access for each system role.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {Object.keys(DEFAULT_ROLE_PERMISSIONS).map((role) => (
                    <div key={role} className="border rounded-md p-4">
                      <h3 className="text-lg font-semibold mb-3">
                        {role.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2">
                        {ALL_PERMISSIONS.map((permission) => (
                          <div key={permission} className="flex items-center space-x-2">
                            <Switch
                              id={`default-${role}-${permission}`}
                              checked={defaultRolePermissions[role]?.includes(permission) || false}
                              onCheckedChange={(checked) =>
                                handleDefaultRolePermissionChange(role, permission, checked)
                              }
                            />
                            <Label htmlFor={`default-${role}-${permission}`}>
                              {permission.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <Button onClick={handleSaveDefaultRolePermissions}>Save Default Role Permissions</Button>
                </CardContent>
              </Card>

              {/* Individual User Overrides */}
              <Card>
                <CardHeader>
                  <CardTitle>Individual User Overrides</CardTitle>
                  <CardDescription>Tweak permissions for specific users.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockCustomers.map((customer) => (
                        <TableRow key={customer.id}>
                          <TableCell>{customer.name}</TableCell>
                          <TableCell>{customer.email}</TableCell>
                          <TableCell>
                            {customer.role?.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "Customer"}
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" onClick={() => handleOpenUserPermissionsModal(customer)}>
                              Manage Permissions
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
              <CardDescription>Connect with third-party services.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label htmlFor="smsApiKey" className="md:text-right">
                  SMS API Key
                </Label>
                <Input
                  id="smsApiKey"
                  type="password"
                  value={integrationSettings.smsApiKey}
                  onChange={(e) => handleInputChange(setIntegrationSettings, "smsApiKey", e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label htmlFor="paymentGateway" className="md:text-right">
                  Payment Gateway
                </Label>
                <Select
                  value={integrationSettings.paymentGateway}
                  onValueChange={(value) => handleSelectChange(setIntegrationSettings, "paymentGateway", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select gateway" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stripe">Stripe</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="square">Square</SelectItem>
                    <SelectItem value="cardknox">Cardknox</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {integrationSettings.paymentGateway === "cardknox" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                    <Label htmlFor="cardknoxApiKey" className="md:text-right">
                      Cardknox API Key
                    </Label>
                    <Input
                      id="cardknoxApiKey"
                      type="password"
                      value={integrationSettings.cardknoxApiKey}
                      onChange={(e) => handleInputChange(setIntegrationSettings, "cardknoxApiKey", e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                    <Label htmlFor="cardknoxTerminalId" className="md:text-right">
                      Cardknox Terminal ID
                    </Label>
                    <Input
                      id="cardknoxTerminalId"
                      value={integrationSettings.cardknoxTerminalId}
                      onChange={(e) => handleInputChange(setIntegrationSettings, "cardknoxTerminalId", e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                </>
              )}
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label htmlFor="slackWebhookUrl" className="md:text-right">
                  Slack Webhook URL
                </Label>
                <Input
                  id="slackWebhookUrl"
                  type="url"
                  value={integrationSettings.slackWebhookUrl}
                  onChange={(e) => handleInputChange(setIntegrationSettings, "slackWebhookUrl", e.target.value)}
                  className="col-span-3"
                  placeholder="https://hooks.slack.com/services/..."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label htmlFor="quickbooksClientId" className="md:text-right">
                  QuickBooks Client ID
                </Label>
                <Input
                  id="quickbooksClientId"
                  type="text"
                  value={integrationSettings.quickbooksClientId}
                  onChange={(e) => handleInputChange(setIntegrationSettings, "quickbooksClientId", e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label htmlFor="quickbooksClientSecret" className="md:text-right">
                  QuickBooks Client Secret
                </Label>
                <Input
                  id="quickbooksClientSecret"
                  type="password"
                  value={integrationSettings.quickbooksClientSecret}
                  onChange={(e) => handleInputChange(setIntegrationSettings, "quickbooksClientSecret", e.target.value)}
                  className="col-span-3"
                />
              </div>
              <Button onClick={handleSaveIntegrations}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reporting" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reporting Settings</CardTitle>
              <CardDescription>Configure automated reports.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label htmlFor="reportFrequency" className="md:text-right">
                  Report Frequency
                </Label>
                <Select
                  value={reportingSettings.reportFrequency}
                  onValueChange={(value) => handleSelectChange(setReportingSettings, "reportFrequency", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label htmlFor="reportRecipients" className="md:text-right">
                  Recipients (comma-separated)
                </Label>
                <Input
                  id="reportRecipients"
                  value={reportingSettings.reportRecipients}
                  onChange={(e) => handleInputChange(setReportingSettings, "reportRecipients", e.target.value)}
                  className="col-span-3"
                />
              </div>
              <Button onClick={handleSaveReporting}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mailbox Settings Tab */}
        <TabsContent value="mailboxes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mailbox Management</CardTitle>
              <CardDescription>Add new mailboxes to your inventory.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label htmlFor="newMailboxNumber" className="md:text-right">
                  New Mailbox #
                </Label>
                <Input
                  id="newMailboxNumber"
                  value={newMailboxNumber}
                  onChange={(e) => setNewMailboxNumber(e.target.value)}
                  className="col-span-2"
                  placeholder="e.g., 106"
                />
                <Button onClick={handleAddMailbox} className="col-span-1">
                  Add Mailbox
                </Button>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Existing Mailboxes</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mailbox #</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentMailboxes.map((mailbox) => (
                      <TableRow key={mailbox.id}>
                        <TableCell>{mailbox.number}</TableCell>
                        <TableCell>{mailbox.isAvailable ? "Available" : "Rented"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings Tab */}
        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>Advanced system-wide settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label htmlFor="maintenanceMode" className="md:text-right">
                  Maintenance Mode
                </Label>
                <Switch
                  id="maintenanceMode"
                  checked={systemSettings.maintenanceMode}
                  onCheckedChange={(checked) => handleSwitchChange(setSystemSettings, "maintenanceMode", checked)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label htmlFor="defaultCurrency" className="md:text-right">
                  Default Currency
                </Label>
                <Select
                  value={systemSettings.defaultCurrency}
                  onValueChange={(value) => handleSelectChange(setSystemSettings, "defaultCurrency", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label htmlFor="smsTemplate" className="md:text-right">
                  SMS Template
                </Label>
                <Textarea
                  id="smsTemplate"
                  value={systemSettings.smsTemplate}
                  onChange={(e) => handleInputChange(setSystemSettings, "smsTemplate", e.target.value)}
                  className="col-span-3"
                  placeholder="e.g., Your order {orderId} is ready."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label htmlFor="emailTemplate" className="md:text-right">
                  Email Template
                </Label>
                <Textarea
                  id="emailTemplate"
                  value={systemSettings.emailTemplate}
                  onChange={(e) => handleInputChange(setSystemSettings, "emailTemplate", e.target.value)}
                  className="col-span-3"
                  placeholder="e.g., Hello {customerName}, your order is complete."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label htmlFor="auditLogRetention" className="md:text-right">
                  Audit Log Retention
                </Label>
                <Select
                  value={systemSettings.auditLogRetention}
                  onValueChange={(value) => handleSelectChange(setSystemSettings, "auditLogRetention", value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select retention period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30_days">30 Days</SelectItem>
                    <SelectItem value="90_days">90 Days</SelectItem>
                    <SelectItem value="1_year">1 Year</SelectItem>
                    <SelectItem value="forever">Forever</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label htmlFor="newApiKey" className="md:text-right">
                  API Key Management
                </Label>
                <Input
                  id="newApiKey"
                  value={newApiKey}
                  onChange={(e) => setNewApiKey(e.target.value)}
                  className="col-span-2"
                  placeholder="Enter new API key"
                />
                <Button onClick={handleAddApiKey} className="col-span-1">
                  Add Key
                </Button>
              </div>
              <div className="col-span-4">
                <ul className="list-disc pl-5 text-sm text-muted-foreground">
                  {apiKeys.map((key) => (
                    <li key={key} className="flex items-center justify-between">
                      <span>{key}</span>
                      <Button variant="ghost" size="sm" onClick={() => handleRevokeApiKey(key)}>
                        Revoke
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label htmlFor="storeOpenTime" className="md:text-right">
                  Store Open Time
                </Label>
                <Input
                  id="storeOpenTime"
                  type="time"
                  value={systemSettings.storeOpenTime}
                  onChange={(e) => handleInputChange(setSystemSettings, "storeOpenTime", e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <Label htmlFor="storeCloseTime" className="md:text-right">
                  Store Close Time
                </Label>
                <Input
                  id="storeCloseTime"
                  type="time"
                  value={systemSettings.storeCloseTime}
                  onChange={(e) => handleInputChange(setSystemSettings, "storeCloseTime", e.target.value)}
                  className="col-span-3"
                />
              </div>
              <Button onClick={handleSaveSystemSettings}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedUserForPermissions && (
        <UserPermissionsModal
          isOpen={isUserPermissionsModalOpen}
          onClose={() => setIsUserPermissionsModalOpen(false)}
          user={selectedUserForPermissions}
          defaultRolePermissions={defaultRolePermissions}
          currentUserOverrides={userPermissionOverrides}
          onSaveOverrides={handleSaveUserOverrides}
        />
      )}
    </div>
  )
}
