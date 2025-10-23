'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastProps {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
  onClose: (id: string) => void
}

export function Toast({ id, type, title, message, duration = 5000, onClose }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false)
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    if (duration > 0) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev - (100 / (duration / 100))
          if (newProgress <= 0) {
            clearInterval(interval)
            return 0
          }
          return newProgress
        })
      }, 100)

      const timer = setTimeout(() => {
        handleClose()
      }, duration)

      return () => {
        clearTimeout(timer)
        clearInterval(interval)
      }
    }
  }, [duration])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      onClose(id)
    }, 300) // Match animation duration
  }

  const getToastConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-500',
          iconColor: 'text-green-600',
          progressColor: 'bg-green-500',
          titleColor: 'text-green-900',
          messageColor: 'text-green-700',
        }
      case 'error':
        return {
          icon: XCircle,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-500',
          iconColor: 'text-red-600',
          progressColor: 'bg-red-500',
          titleColor: 'text-red-900',
          messageColor: 'text-red-700',
        }
      case 'warning':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-500',
          iconColor: 'text-orange-600',
          progressColor: 'bg-orange-500',
          titleColor: 'text-orange-900',
          messageColor: 'text-orange-700',
        }
      case 'info':
        return {
          icon: Info,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-500',
          iconColor: 'text-blue-600',
          progressColor: 'bg-blue-500',
          titleColor: 'text-blue-900',
          messageColor: 'text-blue-700',
        }
    }
  }

  const config = getToastConfig()
  const Icon = config.icon

  return (
    <div
      className={`pointer-events-auto mb-4 w-full max-w-sm overflow-hidden rounded-lg border-l-4 shadow-lg transition-all duration-300 ${
        config.bgColor
      } ${config.borderColor} ${
        isExiting
          ? 'translate-x-full opacity-0'
          : 'translate-x-0 opacity-100 animate-in slide-in-from-right'
      }`}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={`shrink-0 ${config.iconColor}`}>
            <Icon className="h-6 w-6" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className={`font-bold text-sm ${config.titleColor}`}>{title}</h4>
            {message && (
              <p className={`mt-1 text-sm ${config.messageColor}`}>{message}</p>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className={`shrink-0 rounded-lg p-1 transition-colors hover:bg-black/10 ${config.iconColor}`}
            aria-label="Close notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      {duration > 0 && (
        <div className="h-1 w-full bg-black/10">
          <div
            className={`h-full transition-all duration-100 ease-linear ${config.progressColor}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  )
}
