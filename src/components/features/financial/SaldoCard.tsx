import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PiggyBank, TrendingUp, TrendingDown } from 'lucide-react'

interface SaldoCardProps {
  totalBalance: number
  tokoBalance: number
  titipanBalance: number
  transactionCount: number
  period: string
  isPositive: boolean
}

export function SaldoCard({
  totalBalance,
  tokoBalance,
  titipanBalance,
  transactionCount,
  period,
  isPositive,
}: SaldoCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <Card className="max-w-md border-2 border-green-300 bg-gradient-to-br from-green-50 to-green-100">
      <CardContent className="pt-6 pb-4">
        {/* Icon */}
        <div className="mb-4 flex justify-center">
          <div className="rounded-2xl bg-green-500 p-4">
            <PiggyBank className="h-8 w-8 text-white" />
          </div>
        </div>

        {/* Title */}
        <div className="mb-2 text-center">
          <h3 className="text-sm font-medium text-green-800">SALDO TERSEDIA</h3>
          <p className="text-xs text-green-600">{transactionCount} transaksi periode ini</p>
        </div>

        {/* Amount (Large, Centered) */}
        <div className="mb-3 text-center">
          <p className="text-4xl font-bold text-green-900">{formatCurrency(totalBalance)}</p>
        </div>

        {/* Status Badge */}
        <div className="mb-4 flex justify-center">
          <Badge className={isPositive ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}>
            {isPositive ? (
              <>
                <TrendingUp className="mr-1 h-3 w-3" />
                Surplus
              </>
            ) : (
              <>
                <TrendingDown className="mr-1 h-3 w-3" />
                Defisit
              </>
            )}
          </Badge>
        </div>

        {/* Breakdown Cards */}
        <div className="mb-4 space-y-2">
          {/* Toko */}
          <div className="rounded-lg border border-green-200 bg-white/60 p-3 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <span className="text-sm font-medium text-gray-700">Toko</span>
              </div>
              <span className="text-sm font-bold text-gray-900">{formatCurrency(tokoBalance)}</span>
            </div>
          </div>

          {/* Titipan */}
          <div className="rounded-lg border border-green-200 bg-white/60 p-3 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-purple-500" />
                <span className="text-sm font-medium text-gray-700">Titipan</span>
              </div>
              <span className="text-sm font-bold text-gray-900">
                {formatCurrency(titipanBalance)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-green-200 pt-3 text-center">
          <p className="text-xs text-green-700">
            Data periode: <span className="font-semibold">{period}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
