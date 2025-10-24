# 🎨 Color Configuration Guide

> How to easily change the color scheme of Web Koperasi UM Bandung

---

## 📍 Current Color Scheme

**Primary**: Orange `#FF7F2E` (HSL: 25 95% 53%)  
**Secondary**: Green `#16a34a` (HSL: 142 76% 36%)  
**Accent**: Amber `#f59e0b` (HSL: 38 92% 50%)

---

## 🔧 How to Change Colors

All colors are defined as **CSS Custom Properties** in `src/app/globals.css`.

### Step 1: Edit `globals.css`

Open `src/app/globals.css` and locate the `:root` section (light mode) and `.dark` section (dark mode).

### Step 2: Update Color Values

Colors use **HSL format** (Hue, Saturation, Lightness) for easy customization.

#### Primary Color (Main brand color)

```css
:root {
  /* Light mode */
  --primary: 25 95% 53%; /* HSL values only, no hsl() wrapper */
  --ring: 25 95% 53%; /* Focus ring matches primary */
}

.dark {
  /* Dark mode - usually slightly brighter */
  --primary: 25 95% 58%;
  --ring: 25 95% 58%;
}
```

**To change to Blue:**

```css
:root {
  --primary: 217 91% 60%; /* Blue */
  --ring: 217 91% 60%;
}
```

**To change to Purple:**

```css
:root {
  --primary: 262 83% 58%; /* Purple */
  --ring: 262 83% 58%;
}
```

#### Secondary Color (Supporting brand color)

```css
:root {
  --secondary: 142 76% 36%; /* Green */
  --success: 142 76% 36%; /* Often same as secondary */
}

.dark {
  --secondary: 142 70% 45%; /* Brighter for dark mode */
  --success: 142 70% 45%;
}
```

#### Accent Color (Highlights, warnings)

```css
:root {
  --accent: 38 92% 50%; /* Amber */
  --warning: 38 92% 50%; /* Often same as accent */
}
```

---

## 🎯 Quick Color Presets

### Option 1: Orange & Green (Current) ✅

```css
:root {
  --primary: 25 95% 53%; /* Orange */
  --secondary: 142 76% 36%; /* Green */
  --accent: 38 92% 50%; /* Amber */
}

.dark {
  --primary: 25 95% 58%; /* Brighter orange */
  --secondary: 142 70% 45%; /* Brighter green */
  --accent: 38 92% 55%; /* Brighter amber */
}
```

### Option 2: Blue & Teal

```css
:root {
  --primary: 217 91% 60%; /* Blue */
  --secondary: 178 84% 40%; /* Teal */
  --accent: 199 89% 48%; /* Cyan */
}

.dark {
  --primary: 217 91% 65%;
  --secondary: 178 84% 45%;
  --accent: 199 89% 53%;
}
```

### Option 3: Purple & Pink

```css
:root {
  --primary: 262 83% 58%; /* Purple */
  --secondary: 330 81% 60%; /* Pink */
  --accent: 291 64% 42%; /* Violet */
}

.dark {
  --primary: 262 83% 63%;
  --secondary: 330 81% 65%;
  --accent: 291 64% 47%;
}
```

### Option 4: Red & Orange

```css
:root {
  --primary: 0 84% 60%; /* Red */
  --secondary: 25 95% 53%; /* Orange */
  --accent: 38 92% 50%; /* Amber */
}

.dark {
  --primary: 0 72% 51%;
  --secondary: 25 95% 58%;
  --accent: 38 92% 55%;
}
```

### Option 5: Emerald & Lime

```css
:root {
  --primary: 158 64% 52%; /* Emerald */
  --secondary: 84 81% 44%; /* Lime */
  --accent: 142 76% 36%; /* Green */
}

.dark {
  --primary: 158 64% 57%;
  --secondary: 84 81% 49%;
  --accent: 142 76% 41%;
}
```

---

## 🛠️ Tools for Color Selection

### 1. HSL Color Picker

- **Website**: https://hslpicker.com/
- Pick colors visually and get HSL values

### 2. Tailwind Color Palette

- **Website**: https://tailwindcss.com/docs/customizing-colors
- Reference for professional color combinations

### 3. Coolors

- **Website**: https://coolors.co/
- Generate color palettes

---

## 📋 All Available Color Variables

### Core Colors

```css
--background         /* Page background */
--foreground         /* Text color */
--card               /* Card backgrounds */
--card-foreground    /* Card text */
--popover            /* Popover/dropdown backgrounds */
--popover-foreground /* Popover text */
```

### Brand Colors

```css
--primary            /* Main brand color */
--primary-foreground /* Text on primary */
--secondary          /* Supporting brand color */
--secondary-foreground
--accent             /* Accent/highlight color */
--accent-foreground
```

### UI States

```css
--muted              /* Subtle backgrounds */
--muted-foreground   /* Subtle text */
--destructive        /* Error/delete actions */
--destructive-foreground
--success            /* Success states */
--success-foreground
--warning            /* Warning states */
--warning-foreground
--info               /* Info states */
--info-foreground
```

### Borders & Inputs

```css
--border             /* Border colors */
--input              /* Input borders */
--ring               /* Focus ring (usually matches primary) */
```

---

## ✅ Testing After Color Changes

After changing colors, test these components:

1. **Buttons** - All variants (default, outline, ghost, etc.)
2. **Cards** - Background and borders
3. **Forms** - Input focus states
4. **Badges** - All variants
5. **Charts** - Data visualization colors
6. **Navigation** - Active states
7. **Modals** - Background and overlays
8. **Dark Mode** - Toggle and verify all colors

---

## 💡 Tips for Choosing Colors

### 1. Contrast Ratios

- Ensure **WCAG AA compliance** (4.5:1 for normal text)
- Use contrast checkers: https://webaim.org/resources/contrastchecker/

### 2. Dark Mode Adjustments

- Dark mode colors should be **5-10% brighter** (higher lightness)
- Maintain same hue and saturation

### 3. Semantic Consistency

- **Primary**: Main actions (CTAs, links)
- **Secondary**: Supporting actions
- **Success**: Confirmations, positive states
- **Warning**: Cautions, important notices
- **Destructive**: Errors, delete actions

### 4. Color Harmony

Choose colors that work well together:

- **Complementary**: Opposite on color wheel (e.g., Orange & Blue)
- **Analogous**: Adjacent on color wheel (e.g., Orange, Red, Yellow)
- **Triadic**: Evenly spaced (e.g., Orange, Green, Purple)

---

## 🔄 Quick Change Workflow

1. **Choose HSL values** using color picker
2. **Update `globals.css`** (`:root` and `.dark`)
3. **Save file** (CSS will auto-reload in dev mode)
4. **Test visually** in browser
5. **Adjust lightness** if contrast is poor
6. **Verify dark mode** by toggling theme
7. **Commit changes** when satisfied

---

## 📱 Color Examples by Component

### Buttons

```tsx
<Button variant="default">    {/* Uses --primary */}
<Button variant="secondary">  {/* Uses --secondary */}
<Button variant="destructive"> {/* Uses --destructive */}
```

### Badges

```tsx
<Badge variant="default">     {/* Uses --primary */}
<Badge variant="secondary">   {/* Uses --secondary */}
<Badge variant="outline">     {/* Uses --border */}
<Badge variant="destructive"> {/* Uses --destructive */}
```

### Charts (Recharts)

Charts automatically use color tokens from Tailwind config, which inherits from CSS variables.

---

## 🎨 Advanced: Gradient Colors

For modern gradient effects, combine colors:

```css
/* In your component */
className="bg-gradient-to-r from-primary to-accent"
```

Gradients work with HSL variables automatically!

---

**Last Updated**: October 25, 2025  
**Current Scheme**: Orange & Green  
**Easy to Change**: ✅ Yes - Just edit HSL values in globals.css
