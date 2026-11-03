# Professional UI Redesign - Quick Reference

## 🎨 NEW COLOR SYSTEM

Use these instead of old colors:

### Primary (Navy) - Replace Blue/Purple/Indigo
```tsx
bg-primary-50    // Light background
bg-primary-500   // Medium
bg-primary-600   // Default solid color
bg-primary-700   // Hover state
text-primary-600 // Text/icons
```

### Accent (Amber) - Replace Yellow/Orange
```tsx
bg-accent-50     // Light background
bg-accent-600    // Default solid color
text-accent-600  // Text/icons
```

### Success (Green)
```tsx
bg-success-50    // Light background
bg-success-600   // Default solid color
text-success-600 // Text/icons
```

### Neutral (Grays)
```tsx
bg-neutral-50    // Very light
bg-neutral-200   // Borders
bg-neutral-600   // Text
bg-neutral-900   // Dark text
```

## 🔲 BORDER RADIUS

**Use these only:**
- `rounded-md` (8px) - Buttons, inputs, small cards
- `rounded-lg` (12px) - Cards, modals, large elements
- `rounded-full` - Avatars ONLY (not icons!)

**NEVER use:**
- ~~`rounded-2xl`~~ ❌
- ~~`rounded-3xl`~~ ❌
- ~~`rounded-full` on icons~~ ❌

## 📦 PROFESSIONAL CARD PATTERN

```tsx
<div className="bg-white rounded-lg p-6 border border-neutral-200
                hover:border-primary-500 hover:shadow-md transition-all
                cursor-pointer">
  {/* Content */}
</div>
```

## 🎯 PROFESSIONAL ICON PATTERN

**OLD (Toyish)**:
```tsx
<div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-full">
  <Icon className="w-8 h-8 text-white" />
</div>
```

**NEW (Professional)**:
```tsx
<div className="bg-primary-50 p-3 rounded-lg">
  <Icon className="w-7 h-7 text-primary-600" />
</div>
```

## 🎨 COLOR REPLACEMENTS

| Old | New |
|-----|-----|
| `from-blue-500 to-blue-600` | `bg-primary-50` |
| `from-purple-*` | `bg-primary-50` (NO PURPLE!) |
| `from-indigo-*` | `bg-primary-50` (NO INDIGO!) |
| `from-green-*` | `bg-success-50` |
| `from-yellow-*` | `bg-accent-50` |
| `from-orange-*` | `bg-accent-50` |

## 🧰 UTILITY CLASSES

Use these from `professional-ui.css`:

```tsx
// Cards
className="pro-card"
className="pro-card-interactive"

// Icons
className="pro-icon-primary"
className="pro-icon-accent"
className="pro-icon-success"

// Buttons
className="pro-button-primary"
className="pro-button-secondary"

// Typography
className="pro-heading-1"
className="pro-heading-2"
className="pro-body"

// Layout
className="pro-grid-2"
className="pro-grid-4"
```

## 🗂️ CONTENT LOCATIONS

| Content | Location |
|---------|----------|
| Why SIMM | About page > Why SIMM tab |
| How To Use | About page > How To Use tab |
| Features | About page > Features tab |
| Sharing Guide | SharePage (top section) |
| Donation | Footer (subtle link) |

## ✅ DO's

✅ Use `rounded-lg` for cards and icons
✅ Use solid color backgrounds (`bg-primary-50`)
✅ Use subtle hover states (border color change)
✅ Use professional color palette (Navy + Amber)
✅ Use white/cream backgrounds
✅ Keep design clean and minimal

## ❌ DON'Ts

❌ Don't use `rounded-2xl` or `rounded-3xl`
❌ Don't use `rounded-full` except on avatars
❌ Don't use gradient backgrounds on icons
❌ Don't use purple or indigo colors
❌ Don't use scale transforms on hover
❌ Don't use glassmorphism backgrounds
