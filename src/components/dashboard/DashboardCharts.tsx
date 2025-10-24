'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts'

interface TrendData {
  date: string
  count: number
}

interface BestSellerData {
  product: {
    name: string
  }
  totalQuantity: number
  totalRevenue: number
}

interface DashboardChartsProps {
  chartData: TrendData[]
  bestSellers: BestSellerData[]
  formatCurrency: (amount: number) => string
}

export function DashboardCharts({ chartData, bestSellers, formatCurrency }: DashboardChartsProps) {
  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f97316', '#14b8a6']

  return (
    <>
      {/* Activity Trends Chart */}
      <div className="rounded-lg border bg-white p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">Tren Aktivitas</h3>
          <p className="text-xs text-gray-500">7 hari terakhir</p>
        </div>
        {chartData.length > 0 ? (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" tick={{ fontSize: 12 }} tickMargin={8} />
                <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} tickMargin={8} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  name="Aktivitas"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex h-72 items-center justify-center text-gray-400">
            <p>Belum ada data aktivitas</p>
          </div>
        )}
      </div>

      {/* Best Sellers Chart */}
      <div className="rounded-lg border bg-white p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">Produk Terlaris</h3>
          <p className="text-xs text-gray-500">30 hari terakhir</p>
        </div>
        {bestSellers && bestSellers.length > 0 ? (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={bestSellers.slice(0, 5)}
                layout="vertical"
                margin={{ left: 120, right: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" stroke="#6b7280" tick={{ fontSize: 12 }} tickMargin={8} />
                <YAxis
                  type="category"
                  dataKey="product.name"
                  stroke="#6b7280"
                  tick={{ fontSize: 11 }}
                  width={110}
                  tickMargin={8}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '12px',
                  }}
                  formatter={(value, name) => {
                    if (name === 'totalRevenue') {
                      return [formatCurrency(value as number), 'Pendapatan']
                    }
                    return [value, name === 'totalQuantity' ? 'Terjual' : name]
                  }}
                />
                <Bar dataKey="totalQuantity" name="totalQuantity" radius={[0, 4, 4, 0]}>
                  {bestSellers.slice(0, 5).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex h-72 items-center justify-center text-gray-400">
            <p>Belum ada data penjualan</p>
          </div>
        )}
      </div>
    </>
  )
}
