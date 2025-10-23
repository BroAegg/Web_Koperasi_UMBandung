'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LogOut, User, Clock, Shield, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { getCurrentUser, getRoleDisplayName, clearUserData, type UserData } from '@/lib/user-utils'

interface LogoutModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  // Initialize with null, load on client side only
  const [userData, setUserData] = useState<UserData | null>(null)

  useEffect(() => {
    // Load user data only on client side
    if (isOpen) {
      const timer = setTimeout(() => setUserData(getCurrentUser()), 0)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Calculate session duration - computed on each render for accuracy

  const getSessionDuration = () => {
    if (!isOpen) return 'Session aktif'

    const loginTime = localStorage.getItem('loginTime')

    if (loginTime) {
      // eslint-disable-next-line react-hooks/purity
      const elapsed = Date.now() - parseInt(loginTime)
      const hours = Math.floor(elapsed / (1000 * 60 * 60))
      const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60))
      return `${hours}h ${minutes}m`
    }

    return 'Session aktif'
  }

  const sessionDuration = getSessionDuration()

  if (!isOpen) return null

  const handleLogout = async () => {
    setIsLoggingOut(true)

    // Simulate logout process
    setTimeout(() => {
      // Clear session data using utility
      clearUserData()
      localStorage.clear()
      sessionStorage.clear()

      // Redirect to login
      router.push('/login')
    }, 1000)
  }

  return (
    <div className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm duration-200">
      <Card className="animate-in zoom-in w-full max-w-md shadow-2xl duration-200">
        {/* Header with Gradient */}
        <div className="rounded-t-lg bg-linear-to-r from-red-600 to-orange-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-white/20 p-2.5 backdrop-blur-sm">
                <LogOut className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Konfirmasi Logout</h3>
                <p className="text-sm text-red-50">Anda yakin ingin keluar?</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              disabled={isLoggingOut}
              className="text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <CardContent className="space-y-6 p-6">
          {/* User Info Section */}
          <div className="rounded-xl border-2 border-gray-200 bg-linear-to-br from-gray-50 to-slate-50 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-600">
              <User className="h-4 w-4" />
              Informasi Sesi
            </div>

            <div className="space-y-3">
              {/* User Name */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-500">Nama Pengguna</p>
                  <p className="font-bold text-gray-900">{userData?.fullName || 'User'}</p>
                </div>
                <div
                  className={`rounded-lg px-3 py-1 text-xs font-semibold ${
                    userData?.role === 'ADMIN' || userData?.role === 'SUPER_ADMIN'
                      ? 'border border-purple-200 bg-purple-100 text-purple-700'
                      : 'border border-blue-200 bg-blue-100 text-blue-700'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    {getRoleDisplayName(userData?.role || 'USER')}
                  </div>
                </div>
              </div>

              {/* Username */}
              <div>
                <p className="text-xs text-gray-500">Username</p>
                <p className="font-medium text-gray-700">@{userData?.username || 'user'}</p>
              </div>

              {/* Session Info */}
              <div className="border-t border-gray-200 pt-2">
                <div className="rounded-lg border border-gray-200 bg-white p-2.5">
                  <div className="mb-1 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-blue-600" />
                    <p className="text-xs font-semibold text-gray-600">Durasi Sesi</p>
                  </div>
                  <p className="text-xs font-medium text-gray-700">{sessionDuration}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Warning Message */}
          <div className="rounded-lg border-2 border-orange-200 bg-orange-50 p-4">
            <div className="flex gap-3">
              <div className="shrink-0">
                <div className="rounded-full bg-orange-200 p-2">
                  <LogOut className="h-5 w-5 text-orange-700" />
                </div>
              </div>
              <div>
                <h4 className="mb-1 font-bold text-orange-900">Anda akan keluar dari sistem</h4>
                <p className="text-sm text-orange-700">
                  Pastikan semua pekerjaan telah tersimpan. Anda perlu login kembali untuk mengakses
                  sistem.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoggingOut}
              className="flex-1 border-2"
            >
              Batal
            </Button>
            <Button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex-1 bg-linear-to-r from-red-600 to-orange-600 text-white hover:from-red-700 hover:to-orange-700"
            >
              {isLoggingOut ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Logging out...
                </>
              ) : (
                <>
                  <LogOut className="mr-2 h-4 w-4" />
                  Ya, Logout
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
