import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { TRPCProvider } from '@/components/providers/trpc-provider'
import { ToastProvider } from '@/components/shared/ToastContext'
import { ThemeProvider } from '@/components/providers/ThemeProvider'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Web Koperasi UM Bandung',
  description: 'Sistem Informasi Koperasi Universitas Muhammadiyah Bandung',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          <TRPCProvider>
            <ToastProvider>{children}</ToastProvider>
          </TRPCProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
