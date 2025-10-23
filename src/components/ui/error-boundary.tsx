'use client'

import * as React from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  onReset?: () => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    this.props.onReset?.()
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex min-h-[400px] items-center justify-center p-4">
          <Card className="border-destructive w-full max-w-md">
            <CardHeader>
              <div className="mb-4 flex justify-center">
                <div className="bg-destructive/10 flex h-16 w-16 items-center justify-center rounded-full">
                  <AlertTriangle className="text-destructive h-8 w-8" />
                </div>
              </div>
              <CardTitle className="text-center">Something went wrong</CardTitle>
              <CardDescription className="text-center">
                An unexpected error occurred. Please try again.
              </CardDescription>
            </CardHeader>
            {this.state.error && (
              <CardContent>
                <details className="bg-muted rounded-lg p-4 text-sm">
                  <summary className="cursor-pointer font-medium">Error Details</summary>
                  <pre className="text-muted-foreground mt-2 overflow-x-auto text-xs">
                    {this.state.error.message}
                  </pre>
                </details>
              </CardContent>
            )}
            <CardFooter className="flex justify-center gap-2">
              <Button onClick={this.handleReset} variant="default">
                Try Again
              </Button>
              <Button onClick={() => window.location.reload()} variant="outline">
                Reload Page
              </Button>
            </CardFooter>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

// Hook version for functional components
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])

  return setError
}
