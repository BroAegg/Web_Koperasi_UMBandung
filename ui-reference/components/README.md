# Component Specifications

This folder contains detailed specifications for each UI component in the Web Koperasi UMB system.

## Component Categories

### Financial Components
- `FinancialChart.md` - Main financial visualization chart (500px height)
- `BalanceCard.md` - Current balance display card

### POS Components
- `PaymentModal.md` - Payment processing modal with denomination buttons
- `ProductSelector.md` - Product search and selection interface
- `Cart.md` - Shopping cart component
- `QuickTransactionHistory.md` - Recent transactions sidebar

### Transaction Components
- `ReceiptModal.md` - Transaction receipt display and print
- `TransactionTable.md` - Transaction history table with filters

### Inventory Components
- `ProductGrid.md` - Product card grid layout
- `ProductForm.md` - Add/edit product form
- `StockMovementLog.md` - Stock history tracking

### UI Components
- `Button.md` - Button variants and usage
- `Input.md` - Form input components
- `Modal.md` - Modal dialog patterns
- `Table.md` - Data table component
- `Badge.md` - Status badges

### Developer Components
- `DeveloperToolbar.md` - Bottom developer toolbar
- `RoleToggle.md` - Role switching controls

## Component Structure Template

Each component specification should include:

1. **Overview**: Purpose and use cases
2. **Props/API**: Input parameters and callbacks
3. **Visual States**: Default, hover, active, disabled, loading
4. **Variants**: Different versions (size, color, style)
5. **Examples**: Code snippets and screenshots
6. **Accessibility**: ARIA labels, keyboard navigation
7. **Dependencies**: Required libraries or components
8. **Edge Cases**: Error states, empty states, loading states

## Naming Conventions

- Use PascalCase for component names
- Use kebab-case for filenames
- Prefix with component category (e.g., `pos-`, `financial-`)

## Status

🟢 **Complete**: Specification fully documented
🟡 **In Progress**: Partially documented
🔴 **Pending**: Not yet documented

| Component | Status | Priority |
|-----------|--------|----------|
| FinancialChart | 🟢 Complete | High |
| PaymentModal | 🟢 Complete | High |
| ReceiptModal | 🟢 Complete | High |
| ProductSelector | 🟡 In Progress | Medium |
| TransactionTable | 🔴 Pending | Medium |
