# Tailwind CSS to CSS Modules Conversion Reference

This reference covers the mapping from Tailwind utility classes to CSS Module equivalents. Read this before converting any component.

## Core Principle

Tailwind encodes CSS as atomic utility classes in HTML. CSS Modules encode CSS in `.module.css` files with semantic class names. The conversion translates the *visual result*, not the class names mechanically. Sometimes multiple Tailwind utilities combine to create one visual concept — group them into a single semantic CSS class.

## Table of Contents

1. [Layout](#1-layout)
2. [Spacing](#2-spacing)
3. [Typography](#3-typography)
4. [Colors](#4-colors)
5. [Borders](#5-borders)
6. [Effects](#6-effects)
7. [Transitions and Animation](#7-transitions-and-animation)
8. [Interactive States](#8-interactive-states)
9. [Responsive Breakpoints](#9-responsive-breakpoints)
10. [Dark Mode](#10-dark-mode)
11. [Data Attribute Selectors](#11-data-attribute-selectors)
12. [Ring Utilities](#12-ring-utilities)
13. [The cn() Utility](#13-the-cn-utility)
14. [Variant Pattern with clsx](#14-variant-pattern-with-clsx)

---

## 1. Layout

| Tailwind | CSS |
|----------|-----|
| `flex` | `display: flex` |
| `inline-flex` | `display: inline-flex` |
| `grid` | `display: grid` |
| `hidden` | `display: none` |
| `block` | `display: block` |
| `inline` | `display: inline` |
| `flex-row` | `flex-direction: row` |
| `flex-col` | `flex-direction: column` |
| `items-center` | `align-items: center` |
| `items-start` | `align-items: flex-start` |
| `justify-center` | `justify-content: center` |
| `justify-between` | `justify-content: space-between` |
| `flex-1` | `flex: 1 1 0%` |
| `flex-shrink-0` / `shrink-0` | `flex-shrink: 0` |
| `grid-cols-2` | `grid-template-columns: repeat(2, minmax(0, 1fr))` |
| `gap-2` | `gap: 0.5rem` |
| `relative` | `position: relative` |
| `absolute` | `position: absolute` |
| `fixed` | `position: fixed` |
| `inset-0` | `inset: 0` |
| `overflow-hidden` | `overflow: hidden` |
| `overflow-auto` | `overflow: auto` |

## 2. Spacing

Tailwind's spacing scale: `1` = `0.25rem` (4px at default font size).

| Tailwind | CSS |
|----------|-----|
| `p-0` | `padding: 0` |
| `p-1` | `padding: 0.25rem` |
| `p-2` | `padding: 0.5rem` |
| `p-3` | `padding: 0.75rem` |
| `p-4` | `padding: 1rem` |
| `p-6` | `padding: 1.5rem` |
| `p-8` | `padding: 2rem` |
| `px-4` | `padding-left: 1rem; padding-right: 1rem` |
| `py-2` | `padding-top: 0.5rem; padding-bottom: 0.5rem` |
| `pt-4` | `padding-top: 1rem` |
| `m-0` | `margin: 0` |
| `mx-auto` | `margin-left: auto; margin-right: auto` |
| `mt-2` | `margin-top: 0.5rem` |
| `space-x-2` | Use `gap: 0.5rem` on the flex parent instead |
| `space-y-1` | Use `gap: 0.25rem` on the flex parent instead |

**Tip**: Prefer the project's design token variables when available over hardcoded rem values.

## 3. Typography

| Tailwind | CSS |
|----------|-----|
| `text-sm` | `font-size: 0.875rem; line-height: 1.25rem` |
| `text-base` | `font-size: 1rem; line-height: 1.5rem` |
| `text-lg` | `font-size: 1.125rem; line-height: 1.75rem` |
| `text-xl` | `font-size: 1.25rem; line-height: 1.75rem` |
| `text-2xl` | `font-size: 1.5rem; line-height: 2rem` |
| `font-medium` | `font-weight: 500` |
| `font-semibold` | `font-weight: 600` |
| `font-bold` | `font-weight: 700` |
| `leading-none` | `line-height: 1` |
| `tracking-tight` | `letter-spacing: -0.025em` |
| `tracking-wide` | `letter-spacing: 0.025em` |
| `text-center` | `text-align: center` |
| `text-left` | `text-align: left` |
| `truncate` | `overflow: hidden; text-overflow: ellipsis; white-space: nowrap` |
| `whitespace-nowrap` | `white-space: nowrap` |
| `line-clamp-2` | `display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden` |

## 4. Colors

shadcn/ui uses CSS custom properties for its color system (e.g., `--background`, `--foreground`, `--primary`, `--muted`). Map these to the project's token system.

| Tailwind | CSS |
|----------|-----|
| `bg-background` | `background-color: var(--background)` |
| `bg-primary` | `background-color: var(--primary)` |
| `bg-muted` | `background-color: var(--muted)` |
| `bg-transparent` | `background-color: transparent` |
| `bg-white` | `background-color: #ffffff` |
| `text-foreground` | `color: var(--foreground)` |
| `text-primary-foreground` | `color: var(--primary-foreground)` |
| `text-muted-foreground` | `color: var(--muted-foreground)` |
| `border-input` | `border-color: var(--input)` |
| `border-border` | `border-color: var(--border)` |

**Important**: Check the project's `globals.css` and token files to see which variables are available. If a shadcn token doesn't exist in the project, either add it to the token system or use the closest equivalent.

## 5. Borders

| Tailwind | CSS |
|----------|-----|
| `border` | `border: 1px solid` |
| `border-0` | `border: 0` |
| `border-2` | `border: 2px solid` |
| `border-b` | `border-bottom: 1px solid` |
| `border-t` | `border-top: 1px solid` |
| `rounded` | `border-radius: 0.25rem` |
| `rounded-md` | `border-radius: calc(var(--radius) - 2px)` |
| `rounded-lg` | `border-radius: var(--radius)` |
| `rounded-xl` | `border-radius: 0.75rem` |
| `rounded-full` | `border-radius: 9999px` |

shadcn/ui uses a `--radius` CSS variable for consistent border radius. Check if the project defines one; if not, add it.

## 6. Effects

| Tailwind | CSS |
|----------|-----|
| `shadow` | `box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)` |
| `shadow-sm` | `box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05)` |
| `shadow-md` | `box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)` |
| `shadow-lg` | `box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)` |
| `shadow-none` | `box-shadow: none` |
| `opacity-50` | `opacity: 0.5` |
| `opacity-0` | `opacity: 0` |
| `opacity-100` | `opacity: 1` |

## 7. Transitions and Animation

| Tailwind | CSS |
|----------|-----|
| `transition` | `transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms` |
| `transition-all` | `transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms` |
| `transition-colors` | `transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms` |
| `transition-opacity` | `transition-property: opacity; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms` |
| `duration-200` | `transition-duration: 200ms` |
| `duration-300` | `transition-duration: 300ms` |
| `ease-in-out` | `transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1)` |
| `animate-in` | Use `@keyframes` — see shadcn's `tailwind.config` for the animation definitions |
| `animate-out` | Use `@keyframes` with reverse direction |
| `fade-in-0` | `@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }` |
| `slide-in-from-top-2` | `@keyframes slideInFromTop { from { transform: translateY(-0.5rem) } }` |

For `animate-in`/`animate-out`, shadcn components often use Radix UI's `data-[state=open]`/`data-[state=closed]` to trigger entry/exit animations. Convert these to CSS using data attribute selectors:

```css
.overlay[data-state='open'] {
  animation: fadeIn 150ms ease-out;
}
.overlay[data-state='closed'] {
  animation: fadeOut 150ms ease-in;
}
```

## 8. Interactive States

Tailwind prefixes become CSS pseudo-classes or attribute selectors:

| Tailwind | CSS |
|----------|-----|
| `hover:bg-primary/90` | `.button:hover { background-color: color-mix(in srgb, var(--primary) 90%, transparent) }` |
| `focus:outline-none` | `.button:focus { outline: none }` |
| `focus-visible:ring-2` | `.button:focus-visible { box-shadow: 0 0 0 2px var(--ring) }` (see Ring section) |
| `active:scale-95` | `.button:active { transform: scale(0.95) }` |
| `disabled:opacity-50` | `.button:disabled { opacity: 0.5 }` |
| `disabled:pointer-events-none` | `.button:disabled { pointer-events: none }` |
| `group-hover:opacity-100` | `.group:hover .child { opacity: 1 }` — requires restructuring since CSS Modules scope classes. Use a compound selector or pass a parent class. |
| `peer-checked:bg-primary` | `.peer:checked ~ .target { background-color: var(--primary) }` |
| `first:mt-0` | `.item:first-child { margin-top: 0 }` |
| `last:border-b-0` | `.item:last-child { border-bottom: 0 }` |

**`group-hover` note**: CSS Modules scopes class names, so `group-hover` patterns need special handling. Options:
1. Use `:global(.group)` for the parent class (less ideal).
2. Export both parent and child classes from the same module and compose them:
   ```css
   .trigger:hover + .content { /* ... */ }
   ```
3. Use a data attribute: `[data-hovered] .child { ... }`

## 9. Responsive Breakpoints

Tailwind's responsive prefixes become media queries:

| Tailwind prefix | Media query |
|---------|-------------|
| `sm:` | `@media (min-width: 640px)` |
| `md:` | `@media (min-width: 768px)` |
| `lg:` | `@media (min-width: 1024px)` |
| `xl:` | `@media (min-width: 1280px)` |
| `2xl:` | `@media (min-width: 1536px)` |

```css
/* Tailwind: "hidden md:block" */
.sidebar {
  display: none;
}
@media (min-width: 768px) {
  .sidebar {
    display: block;
  }
}
```

## 10. Dark Mode

Match the project's dark mode strategy. Check `globals.css`:

- If using `prefers-color-scheme`:
  ```css
  @media (prefers-color-scheme: dark) {
    .button { background-color: var(--primary-dark); }
  }
  ```
- If using a `data-theme` or `.dark` class on html/body:
  ```css
  :global([data-theme='dark']) .button {
    background-color: var(--primary-dark);
  }
  ```

The best approach is to define tokens that change in dark mode (in `globals.css` or a tokens file) and reference them in components. This way, individual components don't need dark mode overrides.

## 11. Data Attribute Selectors

Base UI uses `data-*` attributes extensively for component state and styling hooks. This is one of Base UI's strengths — these attributes work naturally with CSS Modules without any workarounds.

### data-slot (styling hooks)

Every Base UI sub-component emits a `data-slot` attribute identifying its role. These are useful for descendant styling within a compound component:

```css
/* Target specific slots within a component */
.dialog [data-slot='dialog-title'] { font-weight: 600; }
.dialog [data-slot='dialog-description'] { color: var(--muted-foreground); }
```

### State attributes

Base UI exposes component state via boolean and value data attributes:

| Attribute | CSS Selector | When |
|-----------|-------------|------|
| `data-popup-open` | `[data-popup-open]` | Popup/dialog is open |
| `data-pressed` | `[data-pressed]` | Toggle is pressed |
| `data-selected` | `[data-selected]` | Item is selected |
| `data-disabled` | `[data-disabled]` | Component is disabled |
| `data-highlighted` | `[data-highlighted]` | Item is keyboard-highlighted |
| `data-side="top"` | `[data-side='top']` | Positioned above trigger |
| `data-side="bottom"` | `[data-side='bottom']` | Positioned below trigger |
| `data-open` | `[data-open]` | Collapsible/accordion is open |
| `data-closed` | `[data-closed]` | Collapsible/accordion is closed |

### Tailwind data-attribute patterns → CSS Module equivalents

| Tailwind | CSS |
|----------|-----|
| `data-[popup-open]:bg-accent` | `.trigger[data-popup-open] { background-color: var(--accent) }` |
| `data-[disabled]:opacity-50` | `.item[data-disabled] { opacity: 0.5 }` |
| `data-[highlighted]:bg-accent` | `.item[data-highlighted] { background-color: var(--accent) }` |
| `data-[side=top]:slide-in-from-bottom` | `.content[data-side='top'] { animation: slideInFromBottom ... }` |
| `data-[state=open]:animate-in` | `.content[data-open] { animation: ... }` |

In CSS Modules, combine the module class with the data attribute:

```css
.content[data-open] {
  animation: slideIn 200ms ease-out;
}

.content[data-side='top'] {
  animation-name: slideInFromBottom;
}

.trigger[data-popup-open] {
  background-color: var(--accent);
}
```

## 12. Ring Utilities

Tailwind's `ring-*` utilities create focus rings using `box-shadow` (not `outline`). They compose additively, which makes them tricky.

| Tailwind | CSS equivalent |
|----------|---------------|
| `ring-0` | `box-shadow: 0 0 0 0px var(--ring)` |
| `ring-1` | `box-shadow: 0 0 0 1px var(--ring)` |
| `ring-2` | `box-shadow: 0 0 0 2px var(--ring)` |
| `ring-offset-2` | Include a gap: `box-shadow: 0 0 0 2px var(--background), 0 0 0 4px var(--ring)` |
| `ring-offset-background` | The offset color is `var(--background)` |
| `ring-ring` | Ring color is `var(--ring)` |

The common shadcn focus pattern:
```css
/* Tailwind: focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 */
.button:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--background), 0 0 0 4px var(--ring);
}
```

If the element also has a regular `box-shadow`, combine them:
```css
.card:focus-visible {
  box-shadow:
    0 0 0 2px var(--background),
    0 0 0 4px var(--ring),
    0 1px 3px 0 rgb(0 0 0 / 0.1); /* original shadow */
}
```

## 13. The cn() Utility

shadcn's Base UI components use a `cn()` utility (from `@/registry/bases/base/lib/utils.ts`) that combines `clsx` and `tailwind-merge`. Since we don't use Tailwind, replace all `cn()` calls with `clsx()`:

```tsx
// shadcn original (Base UI variant)
import { cn } from '@/registry/bases/base/lib/utils';
className={cn('px-4 py-2', variant === 'outline' && 'border', className)}

// CSS Modules conversion
import clsx from 'clsx';
import styles from './Button.module.css';
className={clsx(styles.root, variantClass, sizeClass, className)}
```

`tailwind-merge` is unnecessary because CSS Modules doesn't have class conflicts — each class maps to a unique scoped name.

Also watch for Base UI's `render` prop pattern — some components accept a `render` function that receives the default props. Preserve this pattern in the conversion:

```tsx
// Base UI render prop (keep as-is, just change className)
<SelectPrimitive.Trigger
  render={<button className={clsx(styles.trigger, className)} />}
/>
```

## 14. Variant Pattern with CVA

Use `class-variance-authority` (CVA) to define variant-driven class mappings. CVA pairs naturally with CSS Modules — it maps variant values to CSS Module class names and returns the correct combination. This replaces manual lookup maps and keeps variant types and styles in sync.

```tsx
import { cva } from 'class-variance-authority';

import type { VariantProps } from 'class-variance-authority';

import styles from './button.module.css';

// Name the variant function the same as the component
const button = cva(styles.base, {
  variants: {
    variant: {
      default: styles.default,
      destructive: styles.destructive,
      outline: styles.outline,
      secondary: styles.secondary,
      ghost: styles.ghost,
      link: styles.link,
    },
    size: {
      default: styles.medium,
      sm: styles.small,
      lg: styles.large,
      icon: styles.icon,
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

type Props = VariantProps<typeof button>;

export function Button({ variant, size }: Props) {
  return (
    <button className={button({ variant, size })} />
  );
}
```

```css
/* button.module.css */
.base {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius);
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 150ms, background-color 150ms, border-color 150ms;
}

.base {
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px var(--background), 0 0 0 4px var(--ring);
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }
}

/* Variants */
.default {
  background-color: var(--primary);
  color: var(--primary-foreground);

  &:hover {
    background-color: color-mix(in srgb, var(--primary) 90%, transparent);
  }
}

.destructive { /* ... */ }
.outline { /* ... */ }
.secondary { /* ... */ }
.ghost { /* ... */ }
.link { /* ... */ }

/* Sizes */
.medium {
  height: 2.25rem;
  padding: 0.5rem 1rem;
}
.small {
  height: 2rem;
  padding: 0.25rem 0.75rem;
  font-size: 0.8125rem;
}
.large {
  height: 2.75rem;
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
}
.icon {
  height: 2.25rem;
  width: 2.25rem;
  padding: 0;
}
```

**Why CVA over plain clsx lookups**: CVA centralizes the variant definition — the variant names, their allowed values, and their defaults live in one place. `VariantProps` extracts the type automatically, so you never have a mismatch between the props interface and the available styles. For components without variants (e.g., Card, Separator), plain `clsx` is sufficient — CVA is for components with variant/size matrices.
