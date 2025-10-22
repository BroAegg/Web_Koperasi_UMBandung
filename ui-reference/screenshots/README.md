# Screenshots Guide

This folder contains screenshots of the current working system for UI/UX reference during rebuild.

## Screenshot Organization

### By Page
```
screenshots/
├── dashboard/
│   ├── dashboard-overview.png
│   ├── dashboard-metrics.png
│   └── dashboard-chart.png
├── pos/
│   ├── pos-main-view.png
│   ├── pos-product-selection.png
│   ├── pos-cart.png
│   ├── pos-payment-modal-cash.png
│   ├── pos-payment-modal-transfer.png
│   └── pos-receipt.png
├── financial/
│   ├── financial-page.png
│   ├── financial-chart-detail.png
│   ├── financial-chart-500px.png
│   └── financial-transaction-table.png
├── inventory/
│   ├── inventory-grid.png
│   ├── inventory-table.png
│   ├── inventory-add-product.png
│   └── inventory-stock-movement.png
├── transactions/
│   ├── transactions-list.png
│   ├── transactions-filters.png
│   ├── transactions-receipt-modal.png
│   └── transactions-delete-button.png
└── developer/
    ├── developer-toolbar.png
    ├── role-toggle.png
    └── environment-indicator.png
```

## Screenshot Requirements

### Resolution
- **Desktop**: 1920x1080 (Full HD)
- **Tablet**: 1024x768 (iPad landscape)
- **Mobile**: 375x667 (iPhone SE)

### Format
- **File Type**: PNG (for transparency support)
- **Quality**: High quality, no compression artifacts
- **File Size**: Optimize to < 500KB per screenshot

### Naming Convention
```
{page}-{section}-{variant}.png

Examples:
- pos-payment-modal-cash.png
- financial-chart-500px.png
- transactions-receipt-modal-print.png
```

## What to Capture

### Full Page Screenshots
- Show complete page layout with sidebar and header
- Capture actual data (not empty states)
- Show responsive behavior at different breakpoints

### Component Screenshots
- Focus on specific component
- Show all states (default, hover, active, disabled)
- Capture interactions (modals, dropdowns, tooltips)

### Interaction Flows
- Multi-step processes (e.g., checkout flow)
- Before/after states (e.g., form submission)
- Error states and validation

### Developer Features
- Developer toolbar in action
- Role toggle functionality
- Environment indicators (DEV/PROD)

## Screenshot Checklist

Before taking screenshots:

- ✅ Use realistic test data
- ✅ Clear browser console
- ✅ Hide personal information
- ✅ Check UI is in stable state (no loading spinners)
- ✅ Verify color accuracy
- ✅ Check text is readable
- ✅ Ensure no cut-off elements

## Tools

### Recommended Screenshot Tools
- **Windows**: Snipping Tool, Snip & Sketch
- **Browser**: Chrome DevTools Device Toolbar
- **Extensions**: GoFullPage (full page capture)

### Annotation Tools
- **For Specifications**: Use arrows, boxes, text to highlight features
- **Tool**: Excalidraw, Figma, or simple image editor

## Priority Screenshots Needed

### High Priority (Take First)
1. ✅ Financial page with 500px chart
2. ✅ POS payment modal (Cash mode with 2k-20k buttons)
3. ✅ POS payment modal (Transfer mode with auto-fill)
4. ✅ Receipt modal with print view
5. ✅ Transaction list with delete button (DEVELOPER only)
6. ✅ Developer toolbar in action

### Medium Priority
- Dashboard overview
- Inventory product grid
- Product add/edit form
- Stock movement log
- Transaction filters

### Low Priority
- Empty states
- Loading states
- Error states
- Mobile views

## Usage During Rebuild

These screenshots will serve as:
1. **Visual Reference**: Exact UI to recreate
2. **Feature Checklist**: Ensure no features are missed
3. **UX Patterns**: Maintain consistent user experience
4. **Design System**: Extract colors, spacing, typography
5. **Testing**: Compare old vs new implementation

## Notes

- All screenshots should be taken from **PRODUCTION environment** with real data
- Use **developer mode** to capture developer-specific features
- Take screenshots of **both light backgrounds and colored elements**
- Capture **hover states** using browser DevTools
- Document **animation states** with multiple frames if needed
