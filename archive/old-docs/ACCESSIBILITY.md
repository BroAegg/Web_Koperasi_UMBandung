# Accessibility Guide - Web Koperasi

This document outlines the accessibility features implemented to ensure WCAG 2.1 Level AA compliance.

## 1. Keyboard Navigation

### Skip Links

- **Skip to main content** link appears at the top when using Tab key
- Allows keyboard users to bypass navigation and jump directly to main content
- Implementation: `<SkipLink />` in ResponsiveLayout

### Focus Management

- All interactive elements are keyboard accessible
- Visible focus indicators on all focusable elements (buttons, links, inputs)
- Focus trap in modals prevents focus from escaping dialog

### Keyboard Shortcuts

- **ESC**: Close modals and dialogs
- **Tab/Shift+Tab**: Navigate between interactive elements
- **Enter/Space**: Activate buttons and links
- **Arrow Keys**: Navigate through menus (where applicable)

## 2. Screen Reader Support

### ARIA Labels & Roles

- **role="dialog"** on modals with proper aria-modal="true"
- **aria-label** on icon-only buttons for context
- **aria-labelledby** and **aria-describedby** for modal titles and descriptions
- **aria-hidden="true"** on decorative icons
- **aria-live** regions for dynamic content updates

### Live Regions

- Use `useAnnounce()` hook for screen reader announcements
- Success/error messages announced automatically
- Loading states communicated to screen readers

### Semantic HTML

- Proper heading hierarchy (h1 → h2 → h3)
- `<main>` landmark for main content
- `<nav>` for navigation sections
- `<button>` for interactive actions
- `<a>` for navigation links

## 3. Visual Accessibility

### Color Contrast

- All text meets WCAG AA contrast ratios:
  - Normal text (< 18pt): 4.5:1
  - Large text (≥ 18pt): 3:1
  - UI components: 3:1
- Never rely on color alone to convey information

### Focus Indicators

- Visible 2px outline on focused elements
- Enhanced focus styles with ring-2 ring-blue-400
- Focus indicators never removed without replacement

### Text Sizing

- Base font size: 16px (browser default)
- Responsive text sizing with rem units
- Text can be resized up to 200% without loss of content

## 4. Components with Accessibility Features

### LogoutModal

```tsx
<LogoutModal isOpen={isOpen} onClose={handleClose} />
```

- ✅ Focus trap (Tab cycles within modal)
- ✅ ESC key to close
- ✅ ARIA labels and roles
- ✅ Screen reader announcements
- ✅ Keyboard-only operation

### SkipLink

```tsx
<SkipLink />
```

- ✅ Hidden until focused
- ✅ Appears at top left on Tab
- ✅ Jumps to main content (#main-content)

### VisuallyHidden

```tsx
<VisuallyHidden>Screen reader only text</VisuallyHidden>
```

- ✅ Hidden visually but accessible to screen readers
- ✅ Provides context for icon-only buttons

## 5. Accessibility Hooks

### useFocusTrap

```tsx
const ref = useFocusTrap<HTMLDivElement>(isOpen)
return <div ref={ref}>Modal content</div>
```

- Traps keyboard focus within a container
- Cycles Tab between first and last focusable element
- Auto-focuses first element on mount

### useKeyboardShortcut

```tsx
useKeyboardShortcut('Escape', handleClose)
useKeyboardShortcut('ctrl+s', handleSave)
```

- Register global keyboard shortcuts
- Supports modifiers (Ctrl, Shift, Alt)
- Automatically prevents default behavior

### useAnnounce

```tsx
const announce = useAnnounce()

const handleSave = () => {
  saveToDB()
  announce('Data saved successfully', 'polite')
}
```

- Announce messages to screen readers
- Two priority levels: 'polite' or 'assertive'
- Uses ARIA live regions

### useSkipLink

```tsx
const skipToMain = useSkipLink('main-content')
```

- Focus management for skip links
- Smooth scroll to target element

## 6. Testing Accessibility

### Automated Testing Tools

- **axe DevTools**: Browser extension for accessibility auditing
- **WAVE**: Web accessibility evaluation tool
- **Lighthouse**: Built-in Chrome DevTools accessibility audit

### Manual Testing

- **Keyboard Navigation**: Tab through entire page, verify all interactive elements
- **Screen Reader Testing**:
  - Windows: NVDA (free), JAWS (paid)
  - macOS: VoiceOver (built-in)
  - Mobile: TalkBack (Android), VoiceOver (iOS)
- **Zoom Testing**: Test at 200% browser zoom
- **High Contrast Mode**: Test in Windows High Contrast mode

### Common Issues to Check

- ❌ Links/buttons without accessible names
- ❌ Images without alt text
- ❌ Form inputs without labels
- ❌ Insufficient color contrast
- ❌ Keyboard traps (can't escape)
- ❌ Missing skip links
- ❌ Improper heading hierarchy

## 7. Implementation Checklist

### Page Level

- [x] Skip to main content link
- [x] Semantic HTML5 landmarks
- [x] Proper heading hierarchy
- [x] Keyboard navigation works throughout
- [x] Focus indicators visible

### Forms

- [x] Labels associated with inputs
- [x] Error messages announced to screen readers
- [x] Required fields indicated
- [x] Form validation accessible
- [x] Submit buttons clearly labeled

### Interactive Components

- [x] Buttons have accessible names
- [x] Icon-only buttons have aria-label
- [x] Modals have focus trap
- [x] Dialogs have proper ARIA attributes
- [x] Loading states communicated

### Images & Icons

- [x] Decorative icons have aria-hidden="true"
- [x] Meaningful images have alt text
- [x] Icon buttons have text alternatives
- [x] SVGs have proper titles/descriptions

## 8. WCAG 2.1 Level AA Compliance

### Perceivable

- ✅ 1.1.1 Non-text Content (images have alt text)
- ✅ 1.3.1 Info and Relationships (semantic HTML)
- ✅ 1.4.3 Contrast (Minimum) (4.5:1 for text)
- ✅ 1.4.4 Resize text (responsive sizing)
- ✅ 1.4.11 Non-text Contrast (3:1 for UI components)

### Operable

- ✅ 2.1.1 Keyboard (all functionality via keyboard)
- ✅ 2.1.2 No Keyboard Trap (focus can escape)
- ✅ 2.4.1 Bypass Blocks (skip links)
- ✅ 2.4.3 Focus Order (logical tab order)
- ✅ 2.4.7 Focus Visible (visible focus indicators)

### Understandable

- ✅ 3.1.1 Language of Page (lang attribute)
- ✅ 3.2.1 On Focus (no unexpected context changes)
- ✅ 3.2.2 On Input (predictable behavior)
- ✅ 3.3.1 Error Identification (clear error messages)
- ✅ 3.3.2 Labels or Instructions (form labels)

### Robust

- ✅ 4.1.2 Name, Role, Value (proper ARIA)
- ✅ 4.1.3 Status Messages (live regions)

## 9. Best Practices

### DO

- ✅ Use semantic HTML elements
- ✅ Provide text alternatives for images
- ✅ Test with keyboard only
- ✅ Test with screen readers
- ✅ Maintain proper heading hierarchy
- ✅ Provide visible focus indicators
- ✅ Use ARIA when semantic HTML isn't enough
- ✅ Announce dynamic content changes

### DON'T

- ❌ Remove focus outlines without replacement
- ❌ Use div/span for buttons
- ❌ Rely on color alone for information
- ❌ Create keyboard traps
- ❌ Use placeholder as label
- ❌ Use ARIA when semantic HTML works
- ❌ Block pinch-to-zoom on mobile

## 10. Resources

### Documentation

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [React Accessibility](https://react.dev/learn/accessibility)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

### Testing Tools

- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE](https://wave.webaim.org/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [NVDA Screen Reader](https://www.nvaccess.org/)

---

**Last Updated**: Task 23 - Accessibility Improvements
**WCAG Compliance**: Level AA
**Maintained By**: Development Team
