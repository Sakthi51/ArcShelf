# Design Token System

## Color Tokens

### Dark Theme (Default)
```css
--color-bg-primary: #171717;         /* Sidebar background */
--color-bg-secondary: #212121;       /* Cards, dialogs, elevated surfaces */
--color-bg-tertiary: #2a2a2a;        /* Nested surfaces */
--color-bg-hover: #2f2f2f;           /* Hover state backgrounds */
--color-bg-active: #3a3a3a;          /* Active/pressed state */
--color-bg-selected: #1d3a5c;        /* Selected item background */

--color-border-primary: #2e2e2e;     /* Subtle separators */
--color-border-secondary: #3a3a3a;   /* Input borders */
--color-border-focus: #5c8abd;       /* Focused input border */

--color-text-primary: #ececec;       /* Primary text */
--color-text-secondary: #b4b4b4;     /* Secondary/muted text */
--color-text-tertiary: #7a7a7a;      /* Placeholder, disabled text */
--color-text-inverse: #171717;       /* Text on light backgrounds */

--color-accent-primary: #5c8abd;     /* Primary accent (links, focus) */
--color-accent-hover: #7aa3d4;       /* Accent hover state */
--color-accent-bg: rgba(92, 138, 189, 0.12); /* Accent background tint */

--color-danger: #ef4444;             /* Destructive actions */
--color-danger-bg: rgba(239, 68, 68, 0.08); /* Danger background */
--color-success: #22c55e;            /* Success feedback */
--color-warning: #f59e0b;            /* Warning state */

--color-overlay: rgba(0, 0, 0, 0.55); /* Dialog backdrop */
--color-shadow: rgba(0, 0, 0, 0.25);  /* Shadow color */
```

### Light Theme
```css
--color-bg-primary: #f9f9f9;
--color-bg-secondary: #ffffff;
--color-bg-tertiary: #f3f3f3;
--color-bg-hover: #ececec;
--color-bg-active: #dedede;
--color-bg-selected: #e8f0fb;

--color-border-primary: #e5e5e5;
--color-border-secondary: #d4d4d4;
--color-border-focus: #3b82f6;

--color-text-primary: #111111;
--color-text-secondary: #555555;
--color-text-tertiary: #999999;
--color-text-inverse: #ffffff;

--color-accent-primary: #3b82f6;
--color-accent-hover: #2563eb;
--color-accent-bg: rgba(59, 130, 246, 0.08);

--color-danger: #dc2626;
--color-danger-bg: rgba(220, 38, 38, 0.06);
--color-success: #16a34a;
--color-warning: #d97706;

--color-overlay: rgba(0, 0, 0, 0.3);
--color-shadow: rgba(0, 0, 0, 0.08);
```

---

## Spacing Tokens
```css
--space-0: 0px;
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
```

---

## Typography Tokens
```css
--font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', 'Segoe UI', sans-serif;
--font-family-mono: 'SF Mono', 'Fira Code', 'JetBrains Mono', monospace;

--font-size-xs: 11px;     /* Metadata, timestamps */
--font-size-sm: 12px;     /* Labels, captions */
--font-size-base: 13px;   /* Body text, menu items */
--font-size-md: 14px;     /* Primary content */
--font-size-lg: 16px;     /* Section headers */
--font-size-xl: 20px;     /* Page titles */

--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;

--line-height-tight: 1.2;
--line-height-normal: 1.4;
--line-height-relaxed: 1.6;

--letter-spacing-tight: -0.02em;
--letter-spacing-normal: 0;
```

---

## Border Radius Tokens
```css
--radius-xs: 4px;     /* Small elements, tags */
--radius-sm: 6px;     /* Buttons, small cards */
--radius-md: 8px;     /* Inputs, menu items */
--radius-lg: 10px;    /* Cards, panels, items */
--radius-xl: 12px;    /* Large cards, dialogs */
--radius-2xl: 16px;   /* Major containers */
--radius-full: 9999px; /* Pills, circles */
```

---

## Shadow Tokens
```css
--shadow-xs: 0 1px 2px var(--color-shadow);
--shadow-sm: 0 2px 8px var(--color-shadow);
--shadow-md: 0 4px 16px var(--color-shadow);
--shadow-lg: 0 8px 32px var(--color-shadow);
--shadow-xl: 0 12px 48px var(--color-shadow);

/* Specific use cases */
--shadow-context-menu: 0 4px 24px rgba(0, 0, 0, 0.25);
--shadow-dialog: 0 8px 40px rgba(0, 0, 0, 0.35);
--shadow-toast: 0 4px 16px rgba(0, 0, 0, 0.2);
```

---

## Animation Tokens
```css
--duration-instant: 0ms;
--duration-fast: 100ms;
--duration-normal: 150ms;
--duration-moderate: 200ms;
--duration-slow: 250ms;
--duration-slower: 350ms;

--ease-default: cubic-bezier(0.4, 0, 0.2, 1);          /* Standard */
--ease-in: cubic-bezier(0.4, 0, 1, 1);                 /* Accelerate */
--ease-out: cubic-bezier(0, 0, 0.2, 1);                /* Decelerate */
--ease-spring: cubic-bezier(0.32, 0.72, 0, 1);         /* Arc-style spring */
--ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);      /* Overshoot */
```

### Framer Motion Spring Configs
```typescript
const springs = {
  gentle: { type: 'spring', stiffness: 120, damping: 14 },
  snappy: { type: 'spring', stiffness: 300, damping: 25 },
  bouncy: { type: 'spring', stiffness: 400, damping: 10 },
  smooth: { type: 'spring', stiffness: 200, damping: 20 },
}
```

---

## Size Tokens
```css
--sidebar-width-min: 200px;
--sidebar-width-default: 260px;
--sidebar-width-max: 400px;

--item-height: 36px;
--item-height-compact: 32px;
--folder-indent: 12px;

--header-height: 48px;
--search-height: 40px;

--context-menu-min-width: 180px;
--dialog-width: 380px;

--icon-xs: 14px;
--icon-sm: 16px;
--icon-md: 18px;
--icon-lg: 20px;
--icon-xl: 24px;

--scrollbar-width: 4px;
```

---

## Z-Index Tokens
```css
--z-sidebar: 2147483640;
--z-context-menu: 2147483645;
--z-dialog-backdrop: 2147483646;
--z-dialog: 2147483647;
--z-toast: 2147483647;
--z-tooltip: 2147483648;
```

---

## Tailwind Integration
These tokens map to a custom Tailwind theme configuration extending the default scale. All token values are consumed via CSS custom properties for runtime theme switching.
