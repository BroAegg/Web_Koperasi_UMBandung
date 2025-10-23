# Payment Modal Component

## Overview

Modal for processing payments in POS system. Supports two payment methods: CASH (with denomination buttons) and TRANSFER (auto-fill exact amount). Features currency formatting and real-time change calculation.

## Component Path

`components/pos/PaymentModal.tsx`

## Props/API

```typescript
interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onPaymentComplete: () => void
  total: number
  cartItems: CartItem[]
  selectedProducts: Product[]
}
```

## Visual Specifications

### Dimensions

- **Modal Width**: max-w-2xl (672px)
- **Modal Height**: Auto (content-based)
- **Overlay**: Full screen with backdrop blur
- **Z-index**: 60 (overlay), 70 (modal)

### Colors

- **Overlay**: `bg-black/50 backdrop-blur-sm`
- **Modal Background**: `bg-white`
- **Primary Button**: `bg-emerald-600 hover:bg-emerald-700`
- **Secondary Button**: `bg-gray-200 hover:bg-gray-300`
- **Input Focus**: `focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500`

## Payment Methods

### 1. CASH Mode (Default)

#### Denomination Buttons

8 quick amount buttons arranged in 2 rows:

**Row 1 (Small Denominations):**

- 2.000 (`bg-blue-100 hover:bg-blue-200 text-blue-700`)
- 5.000 (`bg-blue-100 hover:bg-blue-200 text-blue-700`)
- 10.000 (`bg-green-100 hover:bg-green-200 text-green-700`)
- 20.000 (`bg-green-100 hover:bg-green-200 text-green-700`)

**Row 2 (Large Denominations):**

- 50.000 (`bg-yellow-100 hover:bg-yellow-200 text-yellow-700`)
- 100.000 (`bg-orange-100 hover:bg-orange-200 text-orange-700`)
- 200.000 (`bg-red-100 hover:bg-red-200 text-red-700`)
- Uang Pas (`bg-purple-100 hover:bg-purple-200 text-purple-700`)

#### Features

- Click denomination to auto-fill amount paid
- "Uang Pas" button fills exact total
- Manual input supported with auto-formatting
- Real-time change calculation
- Change amount shown in large green text

### 2. TRANSFER Mode

#### Features

- **Auto-fill**: Automatically fills exact amount when switching to TRANSFER
- **No Denominations**: Denomination buttons are hidden
- **Read-only Amount**: Amount paid field becomes read-only (can't be edited)
- **Confirmation Card**: Special card with checklist:
  - ✓ Pembayaran harus TEPAT dengan total tagihan
  - ✓ Pastikan transfer sudah masuk sebelum konfirmasi
  - ✓ Tidak ada kembalian untuk transfer

#### Visual Design

```tsx
<div className="rounded-r-lg border-l-4 border-amber-500 bg-amber-50 p-4">
  <div className="flex items-start">
    <div className="flex-shrink-0">⚠️</div>
    <div className="ml-3">
      <h4 className="text-sm font-medium text-amber-800">Konfirmasi Transfer</h4>
      <div className="mt-2 space-y-1 text-sm text-amber-700">
        <p>✓ Pembayaran harus TEPAT...</p>
        <p>✓ Pastikan transfer sudah masuk...</p>
        <p>✓ Tidak ada kembalian...</p>
      </div>
    </div>
  </div>
</div>
```

## Currency Formatting

### Auto-formatting Function

```typescript
const formatCurrencyInput = (value: string): string => {
  // Remove non-digits
  const numbers = value.replace(/\D/g, '')

  // Add dots for thousands
  return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

const parseCurrencyInput = (value: string): number => {
  return parseInt(value.replace(/\./g, ''), 10) || 0
}
```

### Input Field

```tsx
<input
  type="text" // Changed from "number" to support formatting
  value={formatCurrencyInput(amountPaid.toString())}
  onChange={(e) => {
    const parsed = parseCurrencyInput(e.target.value)
    setAmountPaid(parsed)
  }}
  className="w-full rounded-lg border border-gray-300 px-4 py-2"
  placeholder="0"
  readOnly={paymentMethod === 'TRANSFER'} // Read-only for transfer
/>
```

### Display Format

- **Input**: `5.000` (with dots)
- **Backend**: `5000` (numeric)
- **Display**: `Rp 5.000` (with currency symbol)

## Structure

```tsx
<div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-sm">
  <div className="fixed inset-0 z-70 overflow-y-auto">
    <div className="flex min-h-full items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-2xl font-bold">💰 Pembayaran</h3>
          <button onClick={onClose}>✕</button>
        </div>

        {/* Cart Summary */}
        <div className="mb-6 rounded-lg bg-gray-50 p-4">
          {/* Item list */}
          <div className="text-2xl font-bold text-emerald-600">
            Total: Rp {total.toLocaleString('id-ID')}
          </div>
        </div>

        {/* Payment Method Selector */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          <button
            onClick={() => setPaymentMethod('CASH')}
            className={paymentMethod === 'CASH' ? 'active' : ''}
          >
            💵 Tunai
          </button>
          <button
            onClick={() => {
              setPaymentMethod('TRANSFER')
              setAmountPaid(total) // Auto-fill exact amount
            }}
          >
            🏦 Transfer
          </button>
        </div>

        {/* Conditional: Denomination Buttons (CASH only) */}
        {paymentMethod === 'CASH' && (
          <div className="mb-6 space-y-3">
            <div className="grid grid-cols-4 gap-2">{/* Row 1: Small denominations */}</div>
            <div className="grid grid-cols-4 gap-2">{/* Row 2: Large denominations */}</div>
          </div>
        )}

        {/* Amount Paid Input */}
        <div className="mb-6">
          <label>Jumlah Bayar</label>
          <input
            type="text"
            value={formatCurrencyInput(amountPaid.toString())}
            onChange={handleAmountChange}
            readOnly={paymentMethod === 'TRANSFER'}
          />
        </div>

        {/* CASH: Change Display */}
        {paymentMethod === 'CASH' && amountPaid >= total && (
          <div className="mb-6 rounded-lg bg-green-50 p-4">
            <div className="text-3xl font-bold text-green-600">
              Kembalian: Rp {(amountPaid - total).toLocaleString('id-ID')}
            </div>
          </div>
        )}

        {/* TRANSFER: Confirmation Card */}
        {paymentMethod === 'TRANSFER' && (
          <div className="border-l-4 border-amber-500 bg-amber-50 p-4">
            {/* Confirmation checklist */}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose}>Batal</button>
          <button onClick={handleConfirmPayment} disabled={!isPaymentValid}>
            Konfirmasi Pembayaran
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
```

## Validation Rules

### CASH Mode

- Amount paid MUST be ≥ total
- Show error if amount < total
- Calculate and display change

### TRANSFER Mode

- Amount paid MUST equal total (exactly)
- No manual editing allowed
- No change calculation

### Common

- Cannot confirm with invalid amount
- Loading state during API call
- Error handling for failed payment

## States

### Default (CASH)

- Payment method: CASH
- Amount paid: 0
- Denomination buttons visible
- Change hidden

### CASH with Amount

- Amount entered (manually or via button)
- Change calculated if amount ≥ total
- Confirm button enabled

### TRANSFER Mode

- Payment method: TRANSFER
- Amount automatically set to exact total
- Input field read-only
- Denomination buttons hidden
- Confirmation card visible
- Confirm button enabled

### Loading

```tsx
<button disabled className="cursor-not-allowed opacity-50">
  <span className="animate-spin">⏳</span> Memproses...
</button>
```

### Error

```tsx
<div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3">
  <p className="text-red-700">❌ {errorMessage}</p>
</div>
```

## Usage Example

```tsx
import PaymentModal from '@/components/pos/PaymentModal'

;<PaymentModal
  isOpen={isPaymentModalOpen}
  onClose={() => setIsPaymentModalOpen(false)}
  onPaymentComplete={() => {
    setIsPaymentModalOpen(false)
    setRefreshTransactions((prev) => prev + 1) // Trigger refresh
    toast.success('Pembayaran berhasil!')
  }}
  total={calculateTotal(cart)}
  cartItems={cart}
  selectedProducts={selectedProducts}
/>
```

## API Integration

### Endpoint

```
POST /api/transactions
```

### Request Body

```typescript
{
  products: {
    productId: string
    quantity: number
    price: number
  }
  ;[]
  paymentMethod: 'CASH' | 'TRANSFER'
  totalAmount: number
  amountPaid: number
  changeAmount: number // 0 for TRANSFER
}
```

### Response

```typescript
{
  success: true
  transaction: {
    id: string
    receiptId: string
    totalAmount: number
    paymentMethod: string
    createdAt: string
  }
}
```

## Accessibility

- **Focus Management**: Trap focus inside modal
- **Keyboard**: Enter to confirm, Escape to close
- **ARIA**: `role="dialog"`, `aria-modal="true"`
- **Labels**: All inputs have associated labels

## Dependencies

- React (useState, useEffect)
- Tailwind CSS
- Lucide React (icons)

## Migration Notes

When rebuilding:

1. Keep both CASH and TRANSFER modes
2. Maintain 8 denomination buttons (2k-200k)
3. Preserve currency auto-formatting (dots for thousands)
4. Keep transfer auto-fill behavior
5. Maintain confirmation card for TRANSFER
6. Ensure real-time change calculation
7. Test with various amounts (small, large, exact)

## Related Components

- `QuickTransactionHistory.tsx` - Auto-refreshes after payment
- `ReceiptModal.tsx` - Displays receipt after payment
- `Cart.tsx` - Provides cart items and total
