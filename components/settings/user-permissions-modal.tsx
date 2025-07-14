"use client"

import { useState, useEffect } from "react"
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
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ALL_PERMISSIONS,
  type Permission,
  type RolePermissions,
  type UserPermissionOverrides,
} from "@/data/mock-permissions"
import type { Customer } from "@/data/mock-customers"
import { useToast } from "@/hooks/use-toast"

interface UserPermissionsModalProps {
  isOpen: boolean
  onClose: () => void
  user: Customer
  defaultRolePermissions: RolePermissions
  currentUserOverrides: UserPermissionOverrides
  onSaveOverrides: (userId: string, overrides: { [key in Permission]?: boolean }) => void
}

export function UserPermissionsModal({
  isOpen,
  onClose,
  user,
  defaultRolePermissions,
  currentUserOverrides,
  onSaveOverrides,
}: UserPermissionsModalProps) {
  const { toast } = useToast()
  const [tempOverrides, setTempOverrides] = useState<{ [key in Permission]?: boolean }>({})

  useEffect(() => {
    if (isOpen && user) {
      setTempOverrides(currentUserOverrides[user.id] || {})
    }
  }, [isOpen, user, currentUserOverrides])

  if (!user) return null

  const userRole = user.role || "customer"
  const roleDefaultPermissions = defaultRolePermissions[userRole] || []

  const getEffectivePermission = (permission: Permission): boolean => {
    if (tempOverrides[permission] !== undefined) {
      return tempOverrides[permission]!
    }
    return roleDefaultPermissions.includes(permission)
  }

  const handleTogglePermission = (permission: Permission, checked: boolean) => {
    const isDefault = roleDefaultPermissions.includes(permission)
    let newOverrideValue: boolean | undefined = checked

    // If the new state matches the default, remove the override
    if (checked === isDefault) {
      newOverrideValue = undefined
    }

    setTempOverrides((prev) => {
      const newTemp = { ...prev, [permission]: newOverrideValue }
      // Clean up undefined values
      if (newOverrideValue === undefined) {
        delete newTemp[permission]
      }
      return newTemp
    })
  }

  const handleSave = () => {
    onSaveOverrides(user.id, tempOverrides)
    toast({ title: "Permissions Saved", description: `Permissions for ${user.name} updated.` })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Manage Permissions for {user.name}</DialogTitle>
          <DialogDescription>
            Current Role:{" "}
            <span className="font-semibold">
              {userRole.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </span>
            <br />
            Override default role permissions for this user.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-grow pr-4 -mr-4">
          <div className="grid gap-4 py-4">
            {ALL_PERMISSIONS.map((permission) => {
              const isDefault = roleDefaultPermissions.includes(permission)
              const effective = getEffectivePermission(permission)
              const isOverridden = tempOverrides[permission] !== undefined

              return (
                <div key={permission} className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor={`perm-${permission}`} className="col-span-2 text-left">
                    {permission.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </Label>
                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <span className="text-sm text-muted-foreground">
                      {isOverridden ? "Override" : isDefault ? "Default (Allowed)" : "Default (Denied)"}
                    </span>
                    <Switch
                      id={`perm-${permission}`}
                      checked={effective}
                      onCheckedChange={(checked) => handleTogglePermission(permission, checked)}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
