---
paths: "apps/web/src/**/*.css"
---

# CSS Guidelines

## CSS Modules

You must follow these CSS module conventions:

### Class Naming Rules

- Use CSS modules with `.module.css` extension
- Use `.base` class name for the top-level HTML element of the component
- Use `.container` class name for styles that affect external spacing/positioning or background colors
- Use `.inner` class name for styles that affect internal content and spacing within elements
  - Nest `.inner` classes inside parent classes (never use standalone)
- Use semantic names for specific elements (`.header`, `.content`, `.icon`, etc.)

### Naming Conventions

- Use camelCase for CSS class names (e.g., `.icon`, `.headerTitle`)
- Use kebab-case for keyframe names (e.g., `@keyframes fade-in`, `@keyframes slide-up`)
- Use kebab-case for CSS custom properties (e.g., `--dynamic-top`, `--primary-color`)
- Use kebab-case for CSS variant values in data attributes (e.g., `data-variant="primary"`, `data-size="large"`)

### CSS Structure and Organization

- Use CSS nesting for interactive states (hover, focus, etc.), ARIA states (aria-disabled, aria-selected), and custom data attributes inside their parent selectors
- Use CSS nesting for media queries within each class that needs responsive behavior (not at the bottom)
- Use ARIA attributes or custom data attributes for styling state variations
- Define CSS Variables inside class selectors for dynamic styles that React components will control

### Keyframes Positioning

- For CSS modules: Always place `@keyframes` at the bottom of the CSS file, after all class definitions
  - This keeps animation definitions organized and easy to find
  - Component-specific animations should be defined in the same module file where they're used
- For shared/reusable animations: Consider creating a separate animations file or placing them in a shared styles file

### Example CSS Module Structure

```css
.base {
  --dynamic-top: 0px;
  --dynamic-left: 0px;

  position: relative;
  top: var(--dynamic-top);
  left: var(--dynamic-left);
}

.container {
  display: flex;
  flex-direction: column;
  gap: 16px;

  &.inner {
    padding: 8px;
  }

  @media (width <= 768px) {
    gap: 8px;
    flex-direction: row;
  }
}

.headerContent {
  padding-block-end: 12px;

  &:hover {
    background-color: var(--color-primary);
  }

  &[aria-disabled="true"] {
    opacity: 0.5;
    pointer-events: none;
  }

  &[data-size="large"] {
    padding: 16px;
  }
}

/* Keyframes at bottom */
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
```

## z-index Management

### Core Principles

- Only allow z-index conflicts within individual components
- Prefer source order (later elements stack on top) when possible - avoid z-index when cascading order suffices
- If a component requires two separate stacking contexts, consider splitting into separate components
- Within components, use only `z-index: 1` or `auto` (unspecified)

### Cross-Component Layering

When components must layer above others (modals, headers, tooltips, etc.):

- Define z-index values as CSS custom properties in global styles
- Components reference these variables instead of hardcoding numbers
- shadcn/ui unifies every floating layer at `z-50`; this project follows the same convention. Do not subdivide the overlay band per primitive (modal vs. popover vs. tooltip) — rely on Base UI portal source order to resolve stacking between them.

```css
/* In global CSS */
:root {
  --z-index-sticky: 10; /* header / sticky sidebar, etc. (in normal flow) */
  --z-index-overlay: 50; /* all portaled overlays (modal/popover/dropdown/tooltip/sheet/drawer) */
  --z-index-toast: 60; /* notifications that must sit above overlays */
}

/* In component CSS */
.modal {
  z-index: var(--z-index-overlay);
}
```
