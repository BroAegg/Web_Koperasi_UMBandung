import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { TRPCProvider } from '@/components/providers/trpc-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { ToastProvider } from '@/components/shared/ToastContext'
import { Toaster } from 'sonner'

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
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <TRPCProvider>
            <ToastProvider>
              <div className="animate-fade-in">{children}</div>
            </ToastProvider>
          </TRPCProvider>
          <Toaster
            richColors
            position="top-right"
            toastOptions={{
              className: 'animate-slide-down',
              duration: 3000,
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
