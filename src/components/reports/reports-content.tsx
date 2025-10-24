'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CalendarIcon, Download, FileText } from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { trpc } from '@/lib/trpc'
import { FinancialReport } from './financial-report'
import { SalesReport } from './sales-report'
import { InventoryReport } from './inventory-report'
import { MemberReport } from './member-report'
import { toast } from 'sonner'

export function ReportsContent() {
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // First day of current month
    to: new Date(), // Today
  })

  const { data: reportData, isLoading } = trpc.report.getDashboardReport.useQuery({
    startDate: dateRange.from,
    endDate: dateRange.to,
  })

  const handleExportPDF = () => {
    toast.info('Export PDF', {
      description: 'Fitur export PDF akan segera hadir',
    })
  }

  const handleExportExcel = () => {
    toast.info('Export Excel', {
      description: 'Fitur export Excel akan segera hadir',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Laporan</h1>
          <p className="text-muted-foreground">Analisis dan laporan komprehensif koperasi</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportPDF}>
            <FileText className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={handleExportExcel}>
            <Download className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Date Range Filter */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Periode:</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-60 justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    format(dateRange.from, 'dd MMM yyyy', { locale: id })
                  ) : (
                    <span>Pilih tanggal</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateRange.from}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onSelect={(date: any) => date && setDateRange({ ...dateRange, from: date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <span className="text-muted-foreground">sampai</span>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-60 justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.to ? (
                    format(dateRange.to, 'dd MMM yyyy', { locale: id })
                  ) : (
                    <span>Pilih tanggal</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateRange.to}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onSelect={(date: any) => date && setDateRange({ ...dateRange, to: date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="ml-auto flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setDateRange({
                  from: new Date(new Date().setDate(new Date().getDate() - 7)),
                  to: new Date(),
                })
              }
            >
              7 Hari
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setDateRange({
                  from: new Date(new Date().setDate(new Date().getDate() - 30)),
                  to: new Date(),
                })
              }
            >
              30 Hari
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setDateRange({
                  from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                  to: new Date(),
                })
              }
            >
              Bulan Ini
            </Button>
          </div>
        </div>
      </Card>

      {/* Reports Tabs */}
      {isLoading ? (
        <Card className="p-8">
          <div className="text-muted-foreground text-center">Memuat laporan...</div>
        </Card>
      ) : (
        <Tabs defaultValue="financial" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="financial">Keuangan</TabsTrigger>
            <TabsTrigger value="sales">Penjualan</TabsTrigger>
            <TabsTrigger value="inventory">Inventori</TabsTrigger>
            <TabsTrigger value="member">Anggota</TabsTrigger>
          </TabsList>

          <TabsContent value="financial" className="space-y-4">
            <FinancialReport data={reportData?.financial} dateRange={dateRange} />
          </TabsContent>

          <TabsContent value="sales" className="space-y-4">
            <SalesReport data={reportData?.sales} dateRange={dateRange} />
          </TabsContent>

          <TabsContent value="inventory" className="space-y-4">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <InventoryReport data={reportData?.inventory as any} />
          </TabsContent>

          <TabsContent value="member" className="space-y-4">
            <MemberReport data={reportData?.member} dateRange={dateRange} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
