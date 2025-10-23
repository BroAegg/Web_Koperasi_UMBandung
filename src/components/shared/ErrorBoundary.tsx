'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCcw, Home } from 'lucide-react'

interface ErrorBoundaryProps {
  children: ReactNode
  /**
   * Optional fallback UI
   */
  fallback?: ReactNode
  /**
   * Optional error handler
   */
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * Error Boundary Component
 * Catches React errors and displays a fallback UI
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // TODO: Log to error reporting service (e.g., Sentry)
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    })
  }

  handleGoHome = () => {
    window.location.href = '/koperasi'
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default error UI
      return (
        <div className="flex min-h-screen items-center justify-center bg-neutral-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">Oops! Something went wrong</CardTitle>
                  <p className="mt-1 text-sm text-neutral-600">
                    Terjadi kesalahan yang tidak terduga
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Error Details (only in development) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="rounded-lg bg-neutral-100 p-3">
                  <p className="font-mono text-xs text-neutral-700">{this.state.error.message}</p>
                </div>
              )}

              {/* Help Text */}
              <p className="text-sm text-neutral-600">
                Aplikasi mengalami error. Silakan coba muat ulang halaman atau kembali ke dashboard.
              </p>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button onClick={this.handleReset} variant="default" className="flex-1">
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Muat Ulang
                </Button>
                <Button onClick={this.handleGoHome} variant="outline" className="flex-1">
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Simple Error Display Component
 * For inline error messages
 */
interface ErrorDisplayProps {
  title?: string
  message: string
  onRetry?: () => void
  className?: string
}

export function ErrorDisplay({ title = 'Error', message, onRetry, className }: ErrorDisplayProps) {
  return (
    <Card className={className}>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-neutral-900">{title}</h3>
        <p className="mb-4 max-w-md text-center text-sm text-neutral-600">{message}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="default" size="sm">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Coba Lagi
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
