import React from 'react'

interface PageContainerProps {
  children: React.ReactNode
  className?: string
}

export function PageContainer({ children, className = '' }: PageContainerProps) {
  return <div className={`min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 ${className}`}>{children}</div>
}
