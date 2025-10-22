# Receipt Modal Component

## Overview

Modal for displaying transaction receipts with print functionality. Features clean print layout, transaction details, and proper z-index layering to blur sidebar.

## Component Path
`components/transactions/ReceiptModal.tsx`

## Props/API

```typescript
interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: {
    receiptId: string;
    createdAt: string;
    totalAmount: number;
    paymentMethod: 'CASH' | 'TRANSFER';
    amountPaid: number;
    changeAmount: number;
    user: {
      name: string;
    };
    transaction_items: {
      quantity: number;
      price: number;
      product: {
        name: string;
      };
    }[];
  };
}
```

## Visual Specifications

### Z-index Hierarchy (CRITICAL)
- **Sidebar**: z-50
- **Overlay**: z-60 (MUST be higher than sidebar)
- **Modal Content**: z-70
- **Result**: Sidebar properly blurred by backdrop

### Dimensions
- **Modal Width**: max-w-md (448px) - Compact for receipt
- **Modal Height**: Auto (scroll if needed)
- **Print Width**: 80mm thermal printer standard

### Colors
- **Overlay**: `bg-black/50 backdrop-blur-sm`
- **Modal**: `bg-white`
- **Print Button**: `bg-emerald-600 hover:bg-emerald-700`
- **Close Button**: `bg-gray-200 hover:bg-gray-300`

## Structure

```tsx
{/* Overlay - z-60 to blur sidebar (z-50) */}
<div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-sm" onClick={onClose}>
  
  {/* Modal Container - z-70 */}
  <div className="fixed inset-0 z-70 overflow-y-auto">
    <div className="flex min-h-full items-center justify-center p-4">
      
      {/* Modal Content */}
      <div 
        className="bg-white rounded-lg shadow-xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Receipt Content */}
        <div id="receipt-content" className="p-6">
          {/* Header */}
          <div className="text-center mb-6 border-b-2 border-dashed pb-4">
            <h2 className="text-2xl font-bold">🏪 Koperasi UMB</h2>
            <p className="text-sm text-gray-600">Universitas Muhammadiyah Bandung</p>
            <p className="text-xs text-gray-500 mt-2">
              {new Date(transaction.createdAt).toLocaleString('id-ID')}
            </p>
          </div>

          {/* Receipt ID */}
          <div className="mb-4 text-center">
            <p className="text-xs text-gray-600">No. Struk</p>
            <p className="font-mono text-sm font-bold">{transaction.receiptId}</p>
          </div>

          {/* Cashier */}
          <div className="mb-4 text-sm">
            <p className="text-gray-600">Kasir: {transaction.user.name}</p>
          </div>

          {/* Items Table */}
          <div className="border-t border-b border-dashed py-4 mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-1">Item</th>
                  <th className="text-center py-1">Qty</th>
                  <th className="text-right py-1">Harga</th>
                  <th className="text-right py-1">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {transaction.transaction_items.map((item, index) => (
                  <tr key={index} className="border-b border-dashed">
                    <td className="py-2">{item.product.name}</td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-right">
                      {item.price.toLocaleString('id-ID')}
                    </td>
                    <td className="text-right font-medium">
                      {(item.quantity * item.price).toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>Rp {transaction.totalAmount.toLocaleString('id-ID')}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span>Metode:</span>
              <span className="font-medium">
                {transaction.paymentMethod === 'CASH' ? '💵 Tunai' : '🏦 Transfer'}
              </span>
            </div>

            {transaction.paymentMethod === 'CASH' && (
              <>
                <div className="flex justify-between text-sm">
                  <span>Bayar:</span>
                  <span>Rp {transaction.amountPaid.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Kembalian:</span>
                  <span className="font-bold text-green-600">
                    Rp {transaction.changeAmount.toLocaleString('id-ID')}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 border-t border-dashed pt-4">
            <p>Terima kasih atas kunjungan Anda!</p>
            <p>Barang yang sudah dibeli tidak dapat ditukar</p>
          </div>
        </div>

        {/* Action Buttons (No Print) */}
        <div className="flex gap-3 p-6 pt-0 no-print">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
          >
            Tutup
          </button>
          <button
            onClick={() => window.print()}
            className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
          >
            🖨️ Cetak Struk
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
```

## Print Styles

### CSS (app/print.css)
```css
@media print {
  /* Hide everything except receipt */
  body > *:not(.receipt-modal) {
    display: none !important;
  }

  /* Hide non-printable elements */
  .no-print {
    display: none !important;
  }

  /* Reset modal styles for print */
  .receipt-modal {
    position: static !important;
    background: white !important;
    box-shadow: none !important;
    border-radius: 0 !important;
    max-width: 80mm !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  /* Optimize text for thermal printer */
  #receipt-content {
    font-size: 12pt !important;
    color: black !important;
  }

  /* Ensure borders print */
  .border-dashed {
    border-style: dashed !important;
    border-color: black !important;
  }

  /* Remove page margins */
  @page {
    margin: 0;
    size: 80mm auto;
  }
}
```

### Print Layout
- **Paper Size**: 80mm width (thermal printer)
- **Font Size**: 12pt (readable when printed)
- **Colors**: Convert to black for printing
- **Borders**: Dashed lines for sections
- **No Page Break**: Keep receipt on single page

## Features

### Display
- Clean receipt layout with dashed borders
- Company header with logo emoji
- Receipt ID (unique identifier)
- Cashier name
- Itemized product list with quantities and prices
- Subtotals per item
- Total amount (bold, large)
- Payment method with icon
- Change amount (if CASH)
- Footer with thank you message

### Print
- One-click print button
- Automatically opens print dialog
- Optimized for 80mm thermal printer
- Removes sidebar, header, and buttons from print
- Black and white output
- Compact layout

### Interactions
- Click outside to close
- ESC key to close
- Print button triggers window.print()
- Stop propagation to prevent closing when clicking inside

## States

### Default
- Modal open with full receipt
- Print button enabled
- Close button visible

### Loading (When Opening)
```tsx
<div className="p-6 text-center">
  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto" />
  <p className="mt-2 text-gray-600">Memuat struk...</p>
</div>
```

### Error
```tsx
<div className="p-6 text-center text-red-600">
  <p>❌ Gagal memuat struk</p>
  <button onClick={onClose}>Tutup</button>
</div>
```

## Validation

### Required Fields
- Receipt ID
- Created date
- Total amount
- Payment method
- At least 1 transaction item

### Optional Fields
- Amount paid (required only for CASH)
- Change amount (required only for CASH)
- User name (defaults to "Kasir" if missing)

## Usage Example

```tsx
import ReceiptModal from '@/components/transactions/ReceiptModal';

// In Transaction List
const [selectedTransaction, setSelectedTransaction] = useState(null);

<ReceiptModal
  isOpen={!!selectedTransaction}
  onClose={() => setSelectedTransaction(null)}
  transaction={selectedTransaction}
/>

// Trigger from row click
<tr onClick={() => setSelectedTransaction(transaction)}>
  <td>{transaction.receiptId}</td>
  <td>Lihat Struk</td>
</tr>
```

## Accessibility

### Focus Management
- Focus traps inside modal when open
- Return focus to trigger element on close

### Keyboard Navigation
- **ESC**: Close modal
- **Enter**: Print receipt (when print button focused)
- **Tab**: Navigate between close and print buttons

### Screen Reader
- `role="dialog"`
- `aria-modal="true"`
- `aria-labelledby="receipt-title"`
- Announce receipt ID and total

## Dependencies
- React
- Tailwind CSS
- Print.css (global stylesheet)

## Performance
- Memoize transaction data
- Avoid re-renders when modal closed
- Optimize print preview generation

## Migration Notes

### CRITICAL: Z-index Fix
When rebuilding, ensure:
1. **Overlay**: MUST use `z-60` (not z-40 or z-50)
2. **Modal**: MUST use `z-70` (not z-50 or z-60)
3. **Reason**: Sidebar has z-50, modal must be higher to blur it

### Other Considerations
1. Keep print styles in separate print.css
2. Test printing on actual thermal printer
3. Verify backdrop blur works on all browsers
4. Test with very long receipts (scrolling)
5. Ensure proper number formatting (Indonesian locale)
6. Maintain dashed border style
7. Keep compact 80mm width for print

## Bug History

### Issue: Sidebar Not Blurring (FIXED)
- **Symptom**: Receipt modal backdrop didn't blur sidebar
- **Cause**: Modal overlay z-40 < Sidebar z-50
- **Solution**: Changed overlay to z-60, modal to z-70
- **Commit**: `02de9b1`
- **Test**: Open receipt modal, sidebar should blur

## Related Components
- `TransactionTable.tsx` - Triggers receipt modal
- `QuickTransactionHistory.tsx` - Shows recent receipts
- `PaymentModal.tsx` - Generates receipt after payment
