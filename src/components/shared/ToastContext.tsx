'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { ToastContainer } from './ToastContainer'
import { ToastType } from './Toast'

interface ToastData {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface ToastContextType {
  showToast: (toast: Omit<ToastData, 'id'>) => void
  success: (title: string, message?: string, duration?: number) => void
  error: (title: string, message?: string, duration?: number) => void
  warning: (title: string, message?: string, duration?: number) => void
  info: (title: string, message?: string, duration?: number) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback((toast: Omit<ToastData, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { ...toast, id }])
  }, [])

  const success = useCallback(
    (title: string, message?: string, duration?: number) => {
      showToast({ type: 'success', title, message, duration })
    },
    [showToast]
  )

  const error = useCallback(
    (title: string, message?: string, duration?: number) => {
      showToast({ type: 'error', title, message, duration })
    },
    [showToast]
  )

  const warning = useCallback(
    (title: string, message?: string, duration?: number) => {
      showToast({ type: 'warning', title, message, duration })
    },
    [showToast]
  )

  const info = useCallback(
    (title: string, message?: string, duration?: number) => {
      showToast({ type: 'info', title, message, duration })
    },
    [showToast]
  )

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
