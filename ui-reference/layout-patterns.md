# Layout Patterns - Web Koperasi UMB

## Page Structure

### Standard Layout
```
┌─────────────────────────────────────────────┐
│ Header (64px height)                        │
│ - Logo + Title                              │
│ - User Menu + Developer Toggle              │
├────────┬────────────────────────────────────┤
│        │                                    │
│ Side   │  Main Content Area                 │
│ bar    │  - Page Title                      │
│        │  - Action Buttons                  │
│ (240px)│  - Filters/Search                  │
│        │  - Content Cards                   │
│        │  - Tables                          │
│        │                                    │
└────────┴────────────────────────────────────┘
```

### Z-index Hierarchy
- **Sidebar**: z-50
- **Modal Overlay**: z-60
- **Modal Content**: z-70
- **Toasts/Notifications**: z-[100]
- **Developer Toolbar**: z-[999]

## Spacing System

### Container Padding
- **Page Container**: `p-6` (24px)
- **Card Padding**: `p-6` (24px)
- **Form Fields**: `p-4` (16px)
- **Table Cells**: `px-6 py-4`

### Margins
- **Section Spacing**: `mb-6` (24px)
- **Card Spacing**: `mb-4` (16px)
- **Element Spacing**: `mb-2` (8px)

### Gaps
- **Grid Gap**: `gap-6` (24px)
- **Flex Gap**: `gap-4` (16px)
- **Button Group**: `gap-2` (8px)

## Component Layouts

### Cards
```typescript
// Standard Card
<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
  <h3 className="text-lg font-semibold mb-4">Title</h3>
  <div className="space-y-4">
    {/* Content */}
  </div>
</div>

// Elevated Card
<div className="bg-white rounded-lg shadow-lg p-6">
  {/* Content */}
</div>

// Gradient Header Card
<div className="bg-white rounded-lg shadow-lg overflow-hidden">
  <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-6 border-b">
    <h3 className="text-2xl font-bold">Title</h3>
  </div>
  <div className="p-6">
    {/* Content */}
  </div>
</div>
```

### Tables
```typescript
// Standard Table Layout
<div className="overflow-x-auto">
  <table className="w-full">
    <thead className="bg-gray-50 border-b">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
          Column
        </th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      <tr className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          Data
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

### Forms
```typescript
// Standard Form Layout
<form className="space-y-6">
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">
      Field Label
    </label>
    <input 
      className="w-full border border-gray-300 rounded-lg px-4 py-2
                 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
    />
  </div>
</form>

// Two Column Form
<form className="grid grid-cols-2 gap-6">
  <div className="space-y-2">
    {/* Field 1 */}
  </div>
  <div className="space-y-2">
    {/* Field 2 */}
  </div>
</form>
```

### Modals
```typescript
// Modal Structure
<div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-sm">
  <div className="fixed inset-0 z-70 overflow-y-auto">
    <div className="flex min-h-full items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Title</h3>
          <button className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        
        {/* Modal Body */}
        <div className="space-y-4">
          {/* Content */}
        </div>
        
        {/* Modal Footer */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
            Cancel
          </button>
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg">
            Confirm
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
```

## Responsive Breakpoints

### Tailwind Defaults
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

### Usage Patterns
```typescript
// Mobile First Approach
<div className="
  grid grid-cols-1        // Mobile: 1 column
  md:grid-cols-2          // Tablet: 2 columns
  lg:grid-cols-3          // Desktop: 3 columns
  gap-6
">
```

## Page-Specific Layouts

### Dashboard
- **Grid**: 3 columns (metric cards)
- **Chart**: Full width, 500px height
- **Table**: Full width, paginated

### POS (Point of Sale)
- **Two Column**: 
  - Left: Product selector (60%)
  - Right: Cart + Payment (40%)
- **Mobile**: Stacked vertical

### Inventory
- **Three Section**:
  - Top: Filters + Actions
  - Middle: Product Grid/Table
  - Bottom: Pagination

### Financial
- **Single Column Stack**:
  - Balance Card (full width)
  - Financial Chart (full width, 500px)
  - Transaction Table (full width)

### Transactions
- **Standard List**:
  - Filters (top)
  - Table (full width)
  - Pagination (bottom)

## Animation Patterns

### Transitions
```css
/* Standard Transition */
transition-all duration-200

/* Hover Scale */
hover:scale-105 transition-transform

/* Color Transition */
transition-colors duration-150
```

### Loading States
```typescript
// Skeleton Loader
<div className="animate-pulse space-y-4">
  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
</div>

// Spinner
<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
```

## Accessibility

### Focus Management
- All interactive elements have visible focus states
- Modal traps focus when open
- Keyboard navigation supported (Tab, Enter, Escape)

### Screen Reader
- Use semantic HTML (`<header>`, `<nav>`, `<main>`, `<article>`)
- Add `aria-label` for icon-only buttons
- Add `role` attributes for custom components

## Print Styles

### Print-specific CSS
```css
@media print {
  /* Hide sidebar, header, buttons */
  .no-print { display: none; }
  
  /* Full width content */
  .print-full-width { width: 100% !important; }
  
  /* Black text for better print */
  .print-text-black { color: black !important; }
}
```
