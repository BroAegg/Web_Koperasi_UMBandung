# Color Palette - Web Koperasi UMB

## Primary Colors

### Emerald (Main Brand)
- `emerald-50`: #f0fdf4 - Light backgrounds
- `emerald-100`: #dcfce7 - Hover states
- `emerald-500`: #10b981 - Primary actions
- `emerald-600`: #059669 - Primary hover
- `emerald-700`: #047857 - Active states
- `emerald-900`: #064e3b - Dark text

### Blue (Secondary)
- `blue-50`: #eff6ff - Light backgrounds
- `blue-100`: #dbeafe - Hover states
- `blue-500`: #3b82f6 - Secondary actions
- `blue-600`: #2563eb - Secondary hover
- `blue-700`: #1d4ed8 - Active states

## Semantic Colors

### Success (Green)
- `green-50`: #f0fdf4
- `green-500`: #22c55e
- `green-600`: #16a34a
- `green-700`: #15803d

### Warning (Yellow)
- `yellow-50`: #fefce8
- `yellow-500`: #eab308
- `yellow-600`: #ca8a04

### Error (Red)
- `red-50`: #fef2f2
- `red-500`: #ef4444
- `red-600`: #dc2626
- `red-700`: #b91c1c

### Info (Cyan)
- `cyan-50`: #ecfeff
- `cyan-500`: #06b6d4
- `cyan-600`: #0891b2

## Neutral Colors

### Gray Scale
- `gray-50`: #f9fafb - Backgrounds
- `gray-100`: #f3f4f6 - Subtle backgrounds
- `gray-200`: #e5e7eb - Borders
- `gray-300`: #d1d5db - Disabled states
- `gray-400`: #9ca3af - Placeholder text
- `gray-500`: #6b7280 - Secondary text
- `gray-600`: #4b5563 - Primary text
- `gray-700`: #374151 - Dark text
- `gray-800`: #1f2937 - Headings
- `gray-900`: #111827 - Heavy text

## Usage Patterns

### Buttons
- **Primary**: `bg-emerald-600` + `hover:bg-emerald-700` + `text-white`
- **Secondary**: `bg-blue-600` + `hover:bg-blue-700` + `text-white`
- **Danger**: `bg-red-600` + `hover:bg-red-700` + `text-white`
- **Ghost**: `bg-transparent` + `hover:bg-gray-100` + `text-gray-700`

### Cards
- **Standard**: `bg-white` + `border border-gray-200` + `shadow-sm`
- **Elevated**: `bg-white` + `shadow-lg` + `border-0`
- **Gradient Header**: `bg-gradient-to-r from-emerald-50 to-blue-50`

### Tables
- **Header**: `bg-gray-50` + `border-b border-gray-200`
- **Row**: `bg-white` + `hover:bg-gray-50`
- **Alt Row**: `bg-gray-50` (if zebra striping)

### Forms
- **Input**: `border-gray-300` + `focus:border-emerald-500` + `focus:ring-emerald-500`
- **Input Error**: `border-red-500` + `focus:ring-red-500`
- **Label**: `text-gray-700` + `font-medium`

### Status Badges
- **Success**: `bg-green-100` + `text-green-800`
- **Warning**: `bg-yellow-100` + `text-yellow-800`
- **Error**: `bg-red-100` + `text-red-800`
- **Info**: `bg-blue-100` + `text-blue-800`
- **Neutral**: `bg-gray-100` + `text-gray-800`

## Chart Colors

### Financial Chart
- **Income Line**: `stroke-emerald-500` + `fill-emerald-100` (gradient)
- **Expense Line**: `stroke-red-500` + `fill-red-100` (gradient)
- **Grid**: `stroke-gray-200`
- **Axes**: `stroke-gray-300`
- **Text**: `text-gray-600`

### Inventory Chart
- **Stock Level**: `bg-blue-500`
- **Low Stock**: `bg-yellow-500`
- **Out of Stock**: `bg-red-500`

## Accessibility

### Text Contrast
- Ensure minimum contrast ratio 4.5:1 for normal text
- Use `text-gray-900` on `bg-white` for maximum readability
- Use `text-white` on colored backgrounds (emerald, blue, red)

### Focus States
- All interactive elements use `focus:ring-2` + `focus:ring-emerald-500` + `focus:ring-offset-2`
- Keyboard navigation clearly visible

## Dark Mode (Future)
*Not yet implemented - placeholder for future enhancement*
