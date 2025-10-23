import { type Role } from '@prisma/client'

/**
 * Permission definitions for each role
 */
export const PERMISSIONS = {
  // Developer: Full system access
  DEVELOPER: {
    canAccessAll: true,
    canManageUsers: true,
    canManageRoles: true,
    canViewLogs: true,
    canManageFinancial: true,
    canManageInventory: true,
    canManagePOS: true,
    canManageSuppliers: true,
    canManageMembers: true,
    canViewReports: true,
    canExportData: true,
  },

  // Super Admin: Administrative permissions
  SUPER_ADMIN: {
    canAccessAll: false,
    canManageUsers: true,
    canManageRoles: false, // Cannot change roles
    canViewLogs: true,
    canManageFinancial: true,
    canManageInventory: true,
    canManagePOS: true,
    canManageSuppliers: true,
    canManageMembers: true,
    canViewReports: true,
    canExportData: true,
  },

  // Admin: Operational management
  ADMIN: {
    canAccessAll: false,
    canManageUsers: false,
    canManageRoles: false,
    canViewLogs: false,
    canManageFinancial: true,
    canManageInventory: true,
    canManagePOS: true,
    canManageSuppliers: true,
    canManageMembers: true,
    canViewReports: true,
    canExportData: true,
  },

  // Kasir: Point of Sale operations
  KASIR: {
    canAccessAll: false,
    canManageUsers: false,
    canManageRoles: false,
    canViewLogs: false,
    canManageFinancial: false, // Can record sales but not manage finances
    canManageInventory: false, // Can view inventory but not manage
    canManagePOS: true,
    canManageSuppliers: false,
    canManageMembers: false,
    canViewReports: false,
    canExportData: false,
  },

  // Staff: Read-only access
  STAFF: {
    canAccessAll: false,
    canManageUsers: false,
    canManageRoles: false,
    canViewLogs: false,
    canManageFinancial: false,
    canManageInventory: false,
    canManagePOS: false,
    canManageSuppliers: false,
    canManageMembers: false,
    canViewReports: true,
    canExportData: false,
  },

  // Supplier: Supplier portal access
  SUPPLIER: {
    canAccessAll: false,
    canManageUsers: false,
    canManageRoles: false,
    canViewLogs: false,
    canManageFinancial: false,
    canManageInventory: false,
    canManagePOS: false,
    canManageSuppliers: false, // Can only view their own data
    canManageMembers: false,
    canViewReports: false,
    canExportData: false,
  },
} as const

/**
 * Check if user has permission
 */
export function hasPermission(role: Role, permission: keyof typeof PERMISSIONS.DEVELOPER): boolean {
  const rolePermissions = PERMISSIONS[role]
  return rolePermissions[permission] || false
}

/**
 * Check if user can access module
 */
export function canAccessModule(role: Role, module: string): boolean {
  switch (module) {
    case 'dashboard':
      return true // All roles can access dashboard

    case 'financial':
      return hasPermission(role, 'canManageFinancial')

    case 'inventory':
      return hasPermission(role, 'canManageInventory') || role === 'KASIR'

    case 'pos':
      return hasPermission(role, 'canManagePOS')

    case 'suppliers':
      return hasPermission(role, 'canManageSuppliers') || role === 'SUPPLIER'

    case 'members':
      return hasPermission(role, 'canManageMembers')

    case 'reports':
      return hasPermission(role, 'canViewReports')

    case 'users':
      return hasPermission(role, 'canManageUsers')

    case 'activity-logs':
      return hasPermission(role, 'canViewLogs')

    default:
      return false
  }
}

/**
 * Get allowed routes for role
 */
export function getAllowedRoutes(role: Role): string[] {
  const routes: string[] = ['/dashboard']

  if (canAccessModule(role, 'financial')) {
    routes.push('/financial')
  }

  if (canAccessModule(role, 'inventory')) {
    routes.push('/inventory')
  }

  if (canAccessModule(role, 'pos')) {
    routes.push('/pos')
  }

  if (canAccessModule(role, 'suppliers')) {
    routes.push('/suppliers')
  }

  if (canAccessModule(role, 'members')) {
    routes.push('/members')
  }

  if (canAccessModule(role, 'reports')) {
    routes.push('/reports')
  }

  if (canAccessModule(role, 'users')) {
    routes.push('/users')
  }

  if (canAccessModule(role, 'activity-logs')) {
    routes.push('/activity-logs')
  }

  return routes
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: Role): string {
  const names: Record<Role, string> = {
    DEVELOPER: 'Developer',
    SUPER_ADMIN: 'Super Admin',
    ADMIN: 'Administrator',
    KASIR: 'Kasir',
    STAFF: 'Staff',
    SUPPLIER: 'Supplier',
  }

  return names[role]
}

/**
 * Get role badge color
 */
export function getRoleBadgeColor(role: Role): string {
  const colors: Record<Role, string> = {
    DEVELOPER: 'bg-purple-500',
    SUPER_ADMIN: 'bg-red-500',
    ADMIN: 'bg-blue-500',
    KASIR: 'bg-green-500',
    STAFF: 'bg-gray-500',
    SUPPLIER: 'bg-orange-500',
  }

  return colors[role]
}
