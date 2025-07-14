import type { Customer } from "./mock-customers"

// Define all possible permissions in the system
export type Permission =
  | "dashboard_view"
  | "pos_access"
  | "inventory_view"
  | "inventory_manage"
  | "customers_view"
  | "customers_manage"
  | "repairs_view"
  | "repairs_manage"
  | "rentals_view"
  | "rentals_manage"
  | "activations_view"
  | "activations_manage"
  | "referrals_view"
  | "referrals_manage"
  | "work_items_view"
  | "work_items_manage"
  | "mailboxes_view"
  | "mailboxes_manage"
  | "messages_view"
  | "messages_manage"
  | "banking_view"
  | "banking_manage"
  | "commissions_view"
  | "commissions_manage"
  | "reports_view"
  | "reports_generate"
  | "settings_general"
  | "settings_pos"
  | "settings_users"
  | "settings_integrations"
  | "settings_reporting"
  | "settings_mailboxes"
  | "settings_system"
  | "settings_permissions" // New permission for managing permissions

// All available permissions for display and selection
export const ALL_PERMISSIONS: Permission[] = [
  "dashboard_view",
  "pos_access",
  "inventory_view",
  "inventory_manage",
  "customers_view",
  "customers_manage",
  "repairs_view",
  "repairs_manage",
  "rentals_view",
  "rentals_manage",
  "activations_view",
  "activations_manage",
  "referrals_view",
  "referrals_manage",
  "work_items_view",
  "work_items_manage",
  "mailboxes_view",
  "mailboxes_manage",
  "messages_view",
  "messages_manage",
  "banking_view",
  "banking_manage",
  "commissions_view",
  "commissions_manage",
  "reports_view",
  "reports_generate",
  "settings_general",
  "settings_pos",
  "settings_users",
  "settings_integrations",
  "settings_reporting",
  "settings_mailboxes",
  "settings_system",
  "settings_permissions",
]

// Type for role-based default permissions
export type RolePermissions = {
  [role: string]: Permission[]
}

// Type for individual user permission overrides
export type UserPermissionOverrides = {
  [userId: string]: {
    [permission in Permission]?: boolean // true for granted, false for denied
  }
}

// Mock default permissions for each role
export const DEFAULT_ROLE_PERMISSIONS: RolePermissions = {
  admin: ALL_PERMISSIONS, // Admin has all permissions by default
  sales_rep: [
    "dashboard_view",
    "pos_access",
    "inventory_view",
    "customers_view",
    "customers_manage",
    "activations_view",
    "activations_manage",
    "referrals_view",
    "referrals_manage",
    "commissions_view",
    "messages_view",
    "messages_manage",
    "work_items_view", // Can view tasks/tickets
  ],
  reseller: [
    "dashboard_view",
    "pos_access", // For their own sales
    "inventory_view",
    "customers_view",
    "customers_manage",
    "commissions_view",
    "activations_view",
    "referrals_view",
  ],
  technician: [
    "dashboard_view",
    "repairs_view",
    "repairs_manage",
    "inventory_view", // For parts
    "work_items_view",
    "work_items_manage", // Can manage repair-related tasks
  ],
  support_agent: [
    "dashboard_view",
    "work_items_view",
    "work_items_manage", // Can manage support tickets
    "messages_view",
    "messages_manage",
    "customers_view",
  ],
  customer: [
    "dashboard_view",
    "repairs_view",
    "rentals_view",
    "activations_view",
    "referrals_view",
    "commissions_view", // If they earn commissions (e.g., referrals)
    "mailboxes_view",
    "messages_view",
    "banking_view", // For their own billing
    "reports_view", // For their own statements
    "work_items_view", // For their own tickets
  ],
}

// Mock storage for user-specific overrides
// In a real app, this would be fetched from a database
export const mockUserPermissionOverrides: UserPermissionOverrides = {
  // Example override: Admin user cannot access POS
  // "admin1": {
  //   pos_access: false,
  // },
  // Example override: Sales Rep can manage inventory (normally not allowed)
  // "sales1": {
  //   inventory_manage: true,
  // }
}

// Helper function to get effective permissions for a user
export const getEffectivePermissions = (
  user: Customer,
  defaultPermissions: RolePermissions,
  userOverrides: UserPermissionOverrides,
): { [key in Permission]: boolean } => {
  const effective: { [key in Permission]: boolean } = {}
  const role = user.role || "customer" // Default to customer if role is undefined

  // Start with default role permissions
  ALL_PERMISSIONS.forEach((permission) => {
    effective[permission] = defaultPermissions[role]?.includes(permission) || false
  })

  // Apply user-specific overrides
  if (userOverrides[user.id]) {
    for (const permission of ALL_PERMISSIONS) {
      if (userOverrides[user.id][permission] !== undefined) {
        effective[permission] = userOverrides[user.id][permission]!
      }
    }
  }

  return effective
}
