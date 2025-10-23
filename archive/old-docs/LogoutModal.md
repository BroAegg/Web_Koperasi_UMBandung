# LogoutModal Component

## 📋 Overview

Beautiful logout confirmation modal with real-time session data, user information display, and smooth animations. Built with shadcn/ui components and Lucide icons.

## ✨ Features

- **Real-time Session Data**: Reads user info from localStorage
- **Beautiful UI**: Red/orange gradient header with backdrop blur
- **Session Information**: Displays user name, role, username, and session duration
- **Role Badge**: Shows user role with Shield icon
- **Warning Message**: Clear warning about logout consequences
- **Loading State**: Spinner animation during logout process
- **Smooth Animations**: Fade-in and zoom-in effects
- **No Activity Logging**: Simple logout flow without API calls

## 🎨 Design Highlights

### Color Scheme

- **Header**: Red-to-orange gradient (`from-red-600 to-orange-600`)
- **Role Badge**: Purple for ADMIN, Blue for other roles
- **Warning Box**: Orange background with border
- **Session Info**: Gray gradient background

### Layout

- Modal overlay with backdrop blur
- Max width: 28rem (448px)
- Responsive padding and spacing
- Rounded corners and shadow effects

## 📦 Props

```typescript
interface LogoutModalProps {
  isOpen: boolean // Controls modal visibility
  onClose: () => void // Function to close modal
}
```

## 🔄 Data Flow

### Session Data Source (localStorage)

```typescript
const userName = localStorage.getItem('userName') || 'Admin Koperasi'
const userRole = localStorage.getItem('userRole') || 'ADMIN'
const username = localStorage.getItem('username') || 'admin'
const loginTime = localStorage.getItem('loginTime')
```

### Session Duration Calculation

- Reads `loginTime` from localStorage
- Calculates duration in hours and minutes
- Updates when modal opens

### Logout Flow

1. User clicks "Ya, Logout" button
2. Loading state activates (1 second delay)
3. Clear localStorage and sessionStorage
4. Redirect to `/login` page
5. No API calls or activity logging

## 💻 Usage Example

```tsx
import { LogoutModal } from '@/components/shared/LogoutModal'
import { useState } from 'react'

function Dashboard() {
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  return (
    <>
      <Button onClick={() => setShowLogoutModal(true)}>Logout</Button>

      <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} />
    </>
  )
}
```

## 🎯 UI Sections

### 1. Header Section

- Red/orange gradient background
- LogOut icon in rounded badge
- Title and subtitle
- Close button (X icon)

### 2. Session Information Card

- User name (bold, large text)
- Role badge with Shield icon
- Username with @ prefix
- Session duration with Clock icon
- Nested border design with gradients

### 3. Warning Message

- Orange themed warning box
- LogOut icon in badge
- Bold title and descriptive text
- Reminds user to save work

### 4. Action Buttons

- **Cancel**: Outline button, closes modal
- **Logout**: Red/orange gradient button
  - Shows spinner when loading
  - Disabled during logout process

## 🎭 States

### Default State

- Modal closed (`isOpen = false`)
- No loading spinner

### Open State

- Modal visible with animations
- Session duration calculated
- User data displayed

### Loading State

- Logout button shows spinner
- Both buttons disabled
- Text changes to "Logging out..."

## 🎨 Visual Features

### Animations

```tsx
// Modal overlay fade-in
className = 'animate-in fade-in duration-200'

// Modal card zoom-in
className = 'animate-in zoom-in duration-200'
```

### Gradients

```tsx
// Header gradient
from-red-600 to-orange-600

// Button gradient
from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700

// Info card gradient
from-gray-50 to-slate-50
```

### Icons Used

- **LogOut**: Main modal icon, warning icon
- **User**: Session info icon
- **Shield**: Role badge icon
- **Clock**: Session duration icon
- **X**: Close button icon

## 📱 Responsive Design

- Full-width on mobile with padding
- Max-width constraint on larger screens
- Flexible button layout
- Proper text scaling

## ⚠️ Important Notes

### No Activity Logging

This version does NOT log logout events to the activity table. This is intentional because:

- Authentication system is incomplete
- Would cause 401 errors from tRPC
- Simple redirect is sufficient for now

### Future Enhancements (when auth is complete)

```typescript
// Add activity logging mutation
const logoutMutation = trpc.auth.logout.useMutation()

const handleLogout = async () => {
  setIsLoggingOut(true)

  try {
    // Log logout activity
    await logoutMutation.mutateAsync()

    // Clear session
    localStorage.clear()
    sessionStorage.clear()

    // Redirect
    router.push('/login')
  } catch (error) {
    toast.error('Error', 'Logout failed')
  }
}
```

## 🔧 Customization

### Change Colors

```tsx
// Change gradient
className = 'from-purple-600 to-pink-600'

// Change role badge color
const roleColor =
  userRole === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
```

### Adjust Timing

```tsx
// Change logout delay
setTimeout(() => {
  // ... logout logic
}, 1000) // Change this value
```

### Modify Session Data

```tsx
// Use different localStorage keys
const userName = localStorage.getItem('user_name')
const userRole = localStorage.getItem('user_role')
```

## 🎉 Integration with Toast System

Can be combined with toast notifications:

```tsx
import { useToast } from '@/components/shared/ToastContext'

const toast = useToast()

const handleLogout = () => {
  // Show success toast before redirect
  toast.success('Logout Berhasil', 'Sampai jumpa kembali!')

  setTimeout(() => {
    localStorage.clear()
    router.push('/login')
  }, 1000)
}
```

## 📊 Component Structure

```
LogoutModal
├── Backdrop Overlay (blur + fade-in)
└── Card Container (zoom-in)
    ├── Header (gradient)
    │   ├── Icon Badge (LogOut)
    │   ├── Title & Subtitle
    │   └── Close Button (X)
    ├── Content
    │   ├── Session Info Card
    │   │   ├── User Name
    │   │   ├── Role Badge
    │   │   ├── Username
    │   │   └── Session Duration
    │   ├── Warning Message
    │   └── Action Buttons
    │       ├── Cancel
    │       └── Logout (with loading)
```

## 🚀 Performance

- Lightweight component
- No unnecessary re-renders
- Efficient localStorage reads
- Smooth animations without lag
- No API calls (minimal network usage)

## ✅ Accessibility

- Close button for keyboard navigation
- Disabled state for buttons
- Clear visual feedback
- Semantic HTML structure
- Proper contrast ratios

---

**Created**: Day 23 - UI/UX Redesign (Task 17)
**Status**: Completed ✅
**Dependencies**: shadcn/ui, Lucide React, Next.js router
**Auth Status**: Simplified version without activity logging
