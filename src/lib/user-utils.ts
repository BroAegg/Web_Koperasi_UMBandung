/**
 * User Utility Functions
 * Helper functions untuk mendapatkan user data dari localStorage
 */

export interface UserData {
  id: string
  username: string
  fullName: string
  email: string
  role: string
  initials: string
}

/**
 * Get current user data from localStorage
 * Returns user data with fallback values if not found
 */
export function getCurrentUser(): UserData {
  if (typeof window === 'undefined') {
    // Server-side fallback
    return {
      id: '',
      username: 'user',
      fullName: 'User',
      email: 'user@koperasi.com',
      role: 'USER',
      initials: 'U',
    }
  }

  const userId = localStorage.getItem('userId') || ''
  const username = localStorage.getItem('username') || 'user'
  const fullName = localStorage.getItem('userName') || 'User Koperasi'
  const email = localStorage.getItem('userEmail') || 'user@koperasi.com'
  const role = localStorage.getItem('userRole') || 'USER'

  // Generate initials from full name
  const initials = fullName
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')

  return {
    id: userId,
    username,
    fullName,
    email,
    role,
    initials,
  }
}

/**
 * Get user role display name
 */
export function getRoleDisplayName(role: string): string {
  const roleMap: Record<string, string> = {
    DEVELOPER: 'Developer',
    SUPER_ADMIN: 'Super Admin',
    ADMIN: 'Admin',
    KASIR: 'Kasir',
    USER: 'User',
  }

  return roleMap[role] || role
}

/**
 * Get user initials for avatar
 */
export function getUserInitials(fullName: string): string {
  return fullName
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')
}

/**
 * Check if user is logged in
 */
export function isUserLoggedIn(): boolean {
  if (typeof window === 'undefined') return false
  return !!localStorage.getItem('userId')
}

/**
 * Clear user data from localStorage
 */
export function clearUserData(): void {
  if (typeof window === 'undefined') return

  localStorage.removeItem('userId')
  localStorage.removeItem('username')
  localStorage.removeItem('userName')
  localStorage.removeItem('userEmail')
  localStorage.removeItem('userRole')
  localStorage.removeItem('loginTime')
}
