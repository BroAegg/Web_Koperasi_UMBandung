'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LogOut, User, Clock, Shield, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

interface LogoutModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [sessionDuration, setSessionDuration] = useState('')

  useEffect(() => {
    // Calculate session duration from localStorage or estimate
    const loginTime = localStorage.getItem('loginTime')
    if (loginTime) {
      const duration = Date.now() - parseInt(loginTime)
      const hours = Math.floor(duration / (1000 * 60 * 60))
      const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60))
      setSessionDuration(`${hours}h ${minutes}m`)
    } else {
      setSessionDuration('Session aktif')
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleLogout = async () => {
    setIsLoggingOut(true)

    // Simulate logout process
    setTimeout(() => {
      // Clear session data
      localStorage.clear()
      sessionStorage.clear()

      // Redirect to login
      router.push('/login')
    }, 1000)
  }

  // Get user data from localStorage (or use defaults)
  const userName = localStorage.getItem('userName') || 'Admin Koperasi'
  const userRole = localStorage.getItem('userRole') || 'ADMIN'
  const username = localStorage.getItem('username') || 'admin'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <Card className="w-full max-w-md shadow-2xl animate-in zoom-in duration-200">
        {/* Header with Gradient */}
        <div className="bg-linear-to-r from-red-600 to-orange-600 px-6 py-4 text-white rounded-t-lg">
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
              className="hover:bg-white/20 text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <CardContent className="p-6 space-y-6">
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
                  <p className="font-bold text-gray-900">{userName}</p>
                </div>
                <div
                  className={`rounded-lg px-3 py-1 text-xs font-semibold ${
                    userRole === 'ADMIN'
                      ? 'bg-purple-100 text-purple-700 border border-purple-200'
                      : 'bg-blue-100 text-blue-700 border border-blue-200'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    {userRole}
                  </div>
                </div>
              </div>

              {/* Username */}
              <div>
                <p className="text-xs text-gray-500">Username</p>
                <p className="font-medium text-gray-700">@{username}</p>
              </div>

              {/* Session Info */}
              <div className="pt-2 border-t border-gray-200">
                <div className="rounded-lg bg-white p-2.5 border border-gray-200">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Clock className="h-3.5 w-3.5 text-blue-600" />
                    <p className="text-xs font-semibold text-gray-600">Durasi Sesi</p>
                  </div>
                  <p className="text-xs text-gray-700 font-medium">{sessionDuration}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Warning Message */}
          <div className="rounded-lg bg-orange-50 border-2 border-orange-200 p-4">
            <div className="flex gap-3">
              <div className="shrink-0">
                <div className="rounded-full bg-orange-200 p-2">
                  <LogOut className="h-5 w-5 text-orange-700" />
                </div>
              </div>
              <div>
                <h4 className="font-bold text-orange-900 mb-1">Anda akan keluar dari sistem</h4>
                <p className="text-sm text-orange-700">
                  Pastikan semua pekerjaan telah tersimpan. Anda perlu login kembali untuk
                  mengakses sistem.
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
              className="flex-1 bg-linear-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white"
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
