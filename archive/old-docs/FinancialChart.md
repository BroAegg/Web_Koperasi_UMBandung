# Financial Chart Component

## Overview

Large financial visualization chart displaying income vs expense trends over time. Enhanced design with 500px height and integrated sales metrics.

## Component Path

`components/financial/FinancialChart.tsx`

## Props/API

```typescript
interface FinancialChartProps {
  data: {
    date: string
    income: number
    expense: number
  }[]
  transactions?: Transaction[] // For integrated metrics
  dailySummary?: {
    totalIncome: number
    totalExpense: number
    transactionCount: number
  }
}
```

## Visual Specifications

### Dimensions

- **Container**: Full width
- **Height**: 500px (enlarged from 400px)
- **SVG ViewBox**: `0 0 800 500`
- **Padding**: 24px (p-6)

### Colors

- **Income Line**: `stroke-emerald-500` (width: 2px)
- **Income Fill**: `fill-emerald-100` (gradient with opacity)
- **Expense Line**: `stroke-red-500` (width: 2px)
- **Expense Fill**: `fill-red-100` (gradient with opacity)
- **Grid Lines**: `stroke-gray-200`
- **Axes**: `stroke-gray-300`
- **Labels**: `text-gray-600` (12px)

### Header

- **Background**: Gradient `from-emerald-50 to-blue-50`
- **Title**: Text-2xl, font-bold, text-gray-800
- **Elevation**: `shadow-lg`
- **Border**: Rounded-lg

### Integrated Sales Metric

- **Position**: Top right of chart header
- **Background**: White card with shadow
- **Content**:
  - Transaction count
  - Total sales amount (formatted)
- **Typography**:
  - Label: text-sm, gray-600
  - Value: text-xl, font-bold, emerald-600

## Structure

```tsx
<div className="overflow-hidden rounded-lg bg-white shadow-lg">
  {/* Header with Gradient */}
  <div className="border-b bg-gradient-to-r from-emerald-50 to-blue-50 p-6">
    <div className="flex items-center justify-between">
      <h3 className="text-2xl font-bold text-gray-800">📊 Grafik Keuangan</h3>

      {/* Integrated Sales Metric */}
      <div className="rounded-lg bg-white px-4 py-2 shadow">
        <div className="text-sm text-gray-600">Total Penjualan</div>
        <div className="text-xl font-bold text-emerald-600">{transactionCount} transaksi</div>
        <div className="text-lg text-gray-700">Rp {totalSales.toLocaleString('id-ID')}</div>
      </div>
    </div>
  </div>

  {/* Chart SVG */}
  <div className="p-6">
    <svg viewBox="0 0 800 500" className="w-full">
      {/* Grid Lines (6 horizontal) */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <line
          key={i}
          x1="60"
          y1={50 + i * 75}
          x2="750"
          y2={50 + i * 75}
          stroke="#e5e7eb"
          strokeWidth="1"
        />
      ))}

      {/* Y-Axis Labels */}
      {/* Income Line Path */}
      {/* Expense Line Path */}
      {/* Data Points */}
      {/* X-Axis Labels */}

      {/* Legend */}
      <g transform="translate(650, 20)">
        <rect x="0" y="0" width="15" height="15" fill="#10b981" />
        <text x="20" y="12" className="text-xs">
          Pemasukan
        </text>

        <rect x="0" y="25" width="15" height="15" fill="#ef4444" />
        <text x="20" y="37" className="text-xs">
          Pengeluaran
        </text>
      </g>
    </svg>
  </div>
</div>
```

## Features

### Data Visualization

- **Line Chart**: Smooth curves for income and expense
- **Gradient Fill**: Area under curves filled with light color
- **Data Points**: Circles at each data point (hover effect)
- **Grid**: 6 horizontal lines for reference
- **Axes**: Y-axis (amounts), X-axis (dates)

### Interactions

- **Hover**: Show tooltip with exact values
- **Data Points**: Highlight on hover
- **Responsive**: Scale to container width
- **Legend**: Toggle income/expense visibility

### Calculations

- **Y-Axis Scale**: Auto-scale based on max value
- **X-Axis**: Evenly distributed date labels
- **Points**: Plot at `(x, 430 - value * scaleY)`
- **Scale Factor**: `370 / maxValue`

## States

### Default

- Chart rendered with all data
- Both lines visible
- Grid and axes shown

### Loading

```tsx
<div className="flex h-[500px] items-center justify-center">
  <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-emerald-600" />
</div>
```

### Empty

```tsx
<div className="flex h-[500px] items-center justify-center text-gray-400">
  <div className="text-center">
    <p className="text-lg">Belum ada data keuangan</p>
    <p className="text-sm">Transaksi akan muncul di sini</p>
  </div>
</div>
```

### Error

```tsx
<div className="flex h-[500px] items-center justify-center text-red-500">
  <p>Gagal memuat data chart</p>
</div>
```

## Usage Example

```tsx
import FinancialChart from '@/components/financial/FinancialChart'

// In Financial Page
;<FinancialChart
  data={[
    { date: '2025-01-01', income: 5000000, expense: 3000000 },
    { date: '2025-01-02', income: 7000000, expense: 4000000 },
    // ...
  ]}
  transactions={transactions}
  dailySummary={{
    totalIncome: 12000000,
    totalExpense: 7000000,
    transactionCount: 45,
  }}
/>
```

## Dependencies

- React
- Tailwind CSS
- No external chart library (pure SVG)

## Accessibility

- **ARIA Label**: `aria-label="Grafik keuangan harian"`
- **Alt Text**: Descriptive labels for screen readers
- **Keyboard Navigation**: Focus on data points with Tab

## Performance

- **Optimization**: Memoize calculations
- **Throttle**: Limit hover events
- **Lazy Load**: Render only visible portion

## Migration Notes

When rebuilding:

1. Keep 500px height (don't revert to 400px)
2. Maintain gradient header styling
3. Keep integrated sales metric
4. Preserve pure SVG implementation (no external libraries)
5. Ensure responsive behavior
6. Test with various data ranges (empty, small, large)

## Related Components

- `BalanceCard.tsx` - Shows current balance
- `TransactionTable.tsx` - Detailed transaction list
- `FinancialMetricsCards.tsx` - **REMOVED** (deprecated)
